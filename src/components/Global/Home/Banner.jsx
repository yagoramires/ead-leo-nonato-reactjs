import { Link } from 'react-router-dom';

import { Box, Image, Text } from '@chakra-ui/react';

export default function Banner({ post }) {
  return (
    <Box className='w-full h-[206px] relative  overflow-hidden rounded-[20px]'>
      <Image
        src={post.image}
        alt='banner'
        className='w-full h-[206px] object-cover rounded-[20px]'
      />
      <Box className='absolute bottom-3 left-3 text-white text-base leading-5 px-4'>
        <Text className='!font-poppins !font-semibold !text-[22px] !leading-[26px] w-[126px] h-[130px]'>
          {post.title}
        </Text>
        <Text className='!font-poppins !text-[13px] !font-medium !leading-[13px] !tracking-[0.5px]'>
          {post.description}
        </Text>
        <Link
          to='/'
          className='!font-poppins !text-[11px] !font-normal !leading-[11px] !tracking-[0.5px]'
        >
          Assistir agora
        </Link>
      </Box>
    </Box>
  );
}
