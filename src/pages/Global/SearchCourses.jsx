import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCourse } from "../../redux/modules/courses/actions";
import { useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import CourseCard from "./Courses/CourseCard";
import SearchBar from "../../components/SearchBar";
import { Box, Text } from "@chakra-ui/react";

export default function SearchCourses() {
  const { id } = useParams();
  const { searchResults } = useSelector((state) => state.courses);

  const dispatch = useDispatch();

  useEffect(() => {
    const search = id
      .replace(/[áàãâä]/g, "a")
      .replace(/[éèêë]/g, "e")
      .replace(/[íìîï]/g, "i")
      .replace(/[óòõôö]/g, "o")
      .replace(/[úùûü]/g, "u")
      .replace(/ç/g, "c")
      .replace(/[^\w\s]/gi, "")
      .replace("-", " ");

    dispatch(searchCourse(search));
  }, [id]);

  return (
    <Box className="flex min-h-[100dvh] flex-col bg-gray-200">
      <Navbar title={"Pesquisa"} />

      <Box className="px-4  pt-4 lg:hidden">
        <SearchBar type="course" searchPage={true} />
      </Box>

      {searchResults && searchResults?.length > 0 ? (
        <ul className="flex w-full flex-col gap-4 px-4 py-6 lg:mx-auto lg:max-w-5xl">
          {searchResults?.map((course) => (
            <CourseCard course={course} key={course.id} />
          ))}
        </ul>
      ) : (
        <Box className="flex w-full flex-1 flex-col items-center justify-center gap-4 px-4 py-6 lg:mx-auto lg:max-w-5xl">
          <Text>Nenhum curso encontrado.</Text>
        </Box>
      )}
    </Box>
  );
}
