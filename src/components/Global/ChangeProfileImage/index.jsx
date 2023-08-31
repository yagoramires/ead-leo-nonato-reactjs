import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changeProfileImageSchema } from './changeProfileImageSchema';

import useAuth from '../../../hooks/useAuth';

import ModalComponent from '../ModalComponent';
import Input from '../Input';
import ButtonSubmit from '../ButtonSubmit';

import { ModalBody, ModalFooter, Text } from '@chakra-ui/react';

import { IoIosCheckmarkCircleOutline } from 'react-icons/io';

export default function ChangeProfileImage({ openModal, setOpenModal }) {
  const { changeImage, loading } = useAuth();

  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changeProfileImageSchema),
  });

  const handleChange = (formData) => {
    changeImage(formData.url, setSuccess);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSuccess(false);
    reset({ url: '' });
  };

  return (
    <ModalComponent
      title={success ? '' : 'Alterar Imagem'}
      openModal={openModal}
      setOpenModal={setOpenModal}
      handleCloseModal={handleCloseModal}
    >
      {success ? (
        <>
          <ModalBody p={0} mb={8} className='flex flex-col items-center'>
            <IoIosCheckmarkCircleOutline
              className='text-green-200 mb-6'
              size={80}
            />
            <Text className='w-full text-center text-primary-400 poppins text-large font-bold leading-6 '>
              Imagem de perfil alterada!
            </Text>
          </ModalBody>
          <ModalFooter p={0} className='flex flex-col' px={'10px'}>
            <button
              className='w-full disabled:bg-gray-900/30 bg-primary-400 rounded-[4px] px-3 py-[5px] text-white text-base leading-[20px]'
              onClick={handleCloseModal}
            >
              Voltar
            </button>
          </ModalFooter>
        </>
      ) : (
        <>
          <ModalBody p={0} mb={9}>
            <form
              id='changeProfileImageForm'
              onSubmit={handleSubmit(handleChange)}
              className='px-4'
            >
              <Input
                theme={'light'}
                type={'text'}
                label={'URL'}
                placeholder={'https://exemplo.com.br/'}
                register={register}
                id={'url'}
                error={errors?.url?.message}
                watch={watch}
              />
            </form>
          </ModalBody>
          <ModalFooter p={0} className='flex flex-col' px={'10px'}>
            <ButtonSubmit
              form='changeProfileImageForm'
              disabled={false}
              text={'Alterar'}
              loading={loading}
            />
          </ModalFooter>
        </>
      )}
    </ModalComponent>
  );
}
