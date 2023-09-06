import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  fetchVideos,
  selectLesson,
} from '../../../redux/modules/courses/actions';
import { useDispatch, useSelector } from 'react-redux';

import Navbar from '../../../components/Global/Navbar';

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  Avatar,
} from '@chakra-ui/react';

import { Box, Heading } from '@chakra-ui/layout';

import background from '../../../assets/auth-background.png';

export default function Course() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const courses = useSelector((state) => state.courses.courses);
  const course = courses.find((course) => course.id === id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleWatch = () => {
    navigate(`/course/${id}/${course?.videos[0]?.videos[0]?.id}`);
  };

  useEffect(() => {
    const course = courses.find((course) => course.id === id);

    if (!course.videos) {
      dispatch(fetchVideos(id));
    }
  }, []);

  return (
    <Box className='min-h-screen bg-gray-200 flex flex-col'>
      <Navbar title='Curso' />

      <Box className='!h-[118px] rounded-b-2xl overflow-hidden'>
        <Image
          src={background}
          alt='logo'
          className='w-full !object-cover !h-[118px]'
        />
      </Box>

      <Box
        px={6}
        pb={4}
        mt={'-51px'}
        className='flex items-center justify-center flex-col'
      >
        <Avatar
          size='xl'
          bg='blue.500'
          name={course.name}
          src={course.imagePath}
        />
        <Heading
          className='!text-large !font-poppins !font-bold !leading-6'
          mb={8}
          mt={6}
        >
          {course.name}
        </Heading>
        <span
          onClick={handleWatch}
          className='w-full bg-primary-400 rounded-[4px] px-3 py-[5px] text-white text-base leading-5 text-center'
        >
          Assistir
        </span>
      </Box>

      <Box py={4} px={4} bg={'white'} className='!flex-grow'>
        <Heading className='!font-poppins !text-normal !leading-6 !font-medium'>
          Conteúdo
        </Heading>
        <Accordion allowToggle>
          {course &&
            course?.videos?.map((section, i) => (
              <AccordionItem
                key={i}
                className='!border-t-0 !border-b-[1px] !border-gray-200 '
              >
                <AccordionButton px={0} py={4} className='hover:!bg-white'>
                  <Box
                    as='span'
                    flex='1'
                    textAlign='left'
                    className='!text-base !font-medium !leading-5'
                  >
                    {section.section}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4} className='flex flex-col gap-6 '>
                  {section.videos.map((video) => (
                    <Link
                      to={`/course/${id}/${video.id}`}
                      key={video.id}
                      className='font-semibold text-small leading-4'
                    >
                      {video.title}
                    </Link>
                  ))}
                </AccordionPanel>
              </AccordionItem>
            ))}
        </Accordion>
      </Box>
    </Box>
  );
}
