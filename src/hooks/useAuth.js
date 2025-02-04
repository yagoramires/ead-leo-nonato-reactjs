import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth, database, storage } from "../firebase/config";
import {
  updateProfileImage,
  verifyAuthentication,
} from "../redux/modules/auth/actions";
import { useToast } from "@chakra-ui/react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  deleteUser,
  onAuthStateChanged,
} from "firebase/auth";

import {
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { v4 } from "uuid";
import useCheckUpdate from "./useCheckUpdate";

const useAuth = () => {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loading, setLoading] = useState(false);

  const { verifyUsersUpdate } = useCheckUpdate();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const actionCodeSettings = {
    url: `${import.meta.env.VITE_VERCEL_APP_URL}/verify-success`,
    locale: "pt-br",
  };

  const getUserData = async (uid) => {
    try {
      const collectionRef = doc(database, `users/${uid}`);
      const res = await getDoc(collectionRef);

      return res.data();
    } catch (e) {
      console.log(e.message);
    }
  };

  const authUser = () => {
    setLoadingAuth(true);

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const storageData = JSON.parse(localStorage.getItem("user"));

        const firestoreUserUpdate = await verifyUsersUpdate(user.uid);
        const lastUserUpdate =
          new Date(JSON.parse(localStorage.getItem("lastUserUpdate"))) || 0;

        const calcUser = firestoreUserUpdate - lastUserUpdate;

        let userData;

        if (!storageData || calcUser > 0) {
          const collectionData = await getUserData(user.uid);
          userData = {
            ...collectionData,
          };
        } else {
          userData = {
            ...storageData,
          };
        }

        const data = {
          ...userData,
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
        };

        dispatch(verifyAuthentication(data));
        setLoadingAuth(false);
      } else {
        dispatch(verifyAuthentication(null));
        setLoadingAuth(false);
      }
    });
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.message.includes("auth/invalid-login-credentials")) {
        toast({
          description:
            "Usuário não cadastrado, verifique seus dados e tente novamente.",
          status: "error",
          duration: "3000",
          isClosable: true,
        });
      } else {
        toast({
          description: error.message,
          status: "error",
          duration: "3000",
          isClosable: true,
        });
      }
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (registerData) => {
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        registerData.email,
        registerData.password,
      );

      await updateProfile(user, {
        displayName: registerData.name,
      });

      const userData = {
        admin: false,
        name: registerData.name,
        email: registerData.email,
        cpf: registerData.cpf,
        studantClass: registerData.studantClass,
      };

      await setDoc(doc(database, "users", user.uid), userData);

      sendEmailVerification(user, actionCodeSettings);

      const updateTime = Timestamp.now();
      const updateCollection = doc(
        database,
        "updates",
        "users",
        "updates",
        user.uid,
      );

      setDoc(updateCollection, { lastUserUpdate: updateTime });
      const updatedAt = JSON.stringify(new Date(updateTime.toMillis()));
      localStorage.setItem("lastUserUpdate", updatedAt);

      navigate("/verify-phone");
    } catch (error) {
      if (error.message.includes("email-already-in-use")) {
        toast({
          description: "E-mail já cadastrado.",
          status: "error",
          duration: "3000",
          isClosable: true,
        });
      } else {
        toast({
          description: error.message,
          status: "error",
          duration: "3000",
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async () => {
    setLoading(true);
    try {
      await sendEmailVerification(auth._currentUser, actionCodeSettings);
    } catch (error) {
      toast({
        description: error.message,
        status: "error",
        duration: "3000",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, setSuccess = null) => {
    setLoading(true);
    try {
      const actionCodeSettings = {
        url: `${import.meta.env.VITE_VERCEL_APP_URL}/change-password-success`,
        locale: "pt-br",
      };

      await sendPasswordResetEmail(auth, email, actionCodeSettings);

      if (setSuccess) {
        setSuccess(true);
      } else {
        toast({
          description: "E-mail enviado com sucesso",
          status: "success",
          duration: "3000",
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        description: error.message,
        status: "error",
        duration: "3000",
        isClosable: true,
      });
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (newPassword, setSuccess) => {
    setLoading(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      setSuccess(true);
    } catch (error) {
      if (error.message.includes("equires-recent-login")) {
        toast({
          description:
            "A troca de senha necessita de um login recente, por favor saia e entre novamente para fazer a alteração.",
          status: "error",
          duration: "3000",
          isClosable: true,
        });
      } else {
        toast({
          description: error.message,
          status: "error",
          duration: "3000",
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const changeImage = async (image, setSuccess, user) => {
    setLoading(true);

    if (user.profileImageRef) {
      const fileRef = ref(storage, user.profileImageRef);
      await deleteObject(fileRef);
    }

    try {
      const firestoreFileName = `profileImages/${Date.now()}${v4()}`;
      const storageRef = ref(storage, firestoreFileName);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progressStatus =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          switch (snapshot.state) {
            case "paused":
              toast({
                description: "Envio pausado",
                status: "info",
                duration: "3000",
                isClosable: true,
              });
              break;
            default:
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              toast({
                description:
                  "O usuário não tem autorização para acessar o objeto.",
                status: "error",
                duration: "3000",
                isClosable: true,
              });
              break;
            case "storage/canceled":
              toast({
                description: "O usuário cancelou o upload",
                status: "error",
                duration: "3000",
                isClosable: true,
              });
              break;
            default:
              toast({
                description: "Ocorreu um erro, tente novamente.",
                status: "error",
                duration: "3000",
                isClosable: true,
              });
              break;
          }
        },
        async () => {
          try {
            const fileURL = await getDownloadURL(uploadTask.snapshot.ref);

            await updateProfile(auth.currentUser, { photoURL: fileURL });

            const userRef = doc(database, "users", user.uid);
            await updateDoc(userRef, { profileImageRef: fileURL });

            const data = {
              photoURL: fileURL,
              profileImageRef: fileURL,
            };

            dispatch(updateProfileImage(data));
            setSuccess(true);
          } catch (error) {
            toast({
              description: error.message,
              status: "error",
              duration: "3000",
              isClosable: true,
            });
          } finally {
            setLoading(false);
          }
        },
      );
    } catch (error) {
      toast({
        description: error.message,
        status: "error",
        duration: "3000",
        isClosable: true,
      });
    }
  };

  const delUser = async () => {
    try {
      const userDoc = doc(database, "users", auth.currentUser.uid);
      await deleteDoc(userDoc);
      const userUpdateDoc = doc(
        database,
        "updates/users/updates",
        auth.currentUser.uid,
      );
      await deleteDoc(userDoc);
      await deleteDoc(userUpdateDoc);

      localStorage.removeItem("user");
      localStorage.removeItem("lastUserUpdate");
      await deleteUser(auth.currentUser);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    authUser,
    loginUser,
    registerUser,
    verifyEmail,
    resetPassword,
    changePassword,
    changeImage,
    delUser,
    loadingAuth,
    loading,
  };
};

export default useAuth;
