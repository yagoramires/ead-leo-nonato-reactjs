import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Box, Switch, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AddVideoSchema } from './addVideoSchema';
import { fetchVideos } from '../../../../../redux/modules/courses/actions';
import ButtonSubmit from '../../../../../components/Global/ButtonSubmit';
import Input from '../../../../../components/Global/Input';
import Assets from '../../../../../components/Admin/NewVideo/Assets';
import Advertisement from '../../../../../components/Admin/NewVideo/Advertisement';
import Quiz from '../../../../../components/Admin/NewVideo/Quiz';
import Survey from '../../../../../components/Admin/NewVideo/Survey';
import useVideo from '../../../../../hooks/useVideo';

export default function NewVideo() {
  const [videoData, setVideoData] = useState({
    video: {
      videoFile: null,
      videoType: true,
    },
    assets: {
      hasAssets: false,
      assetsList: [],
      assetFile: null,
      assetType: true,
    },
    quiz: {
      hasQuiz: false,
      questionsList: [],
    },
    survey: {
      hasSurvey: false,
      survey: null,
    },
    advertisement: {
      hasAdvertisement: false,
      advertisementList: [],
    },
  });

  const { id } = useParams();
  const { courses } = useSelector((state) => state.courses);
  const course = courses.find((course) => course.id === id);
  const { uploadVideo, loading } = useVideo();

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(AddVideoSchema),
  });

  const handleSwitch = (type) => {
    if (type === 'videoType') {
      setVideoData((prev) => ({
        ...prev,
        video: { video: null, videoType: !prev.video.videoType },
      }));
    } else if (type === 'hasAssets') {
      setVideoData((prev) => ({
        ...prev,
        assets: { ...prev.assets, hasAssets: !prev.assets.hasAssets },
      }));
    } else if (type === 'assetType') {
      setVideoData((prev) => ({
        ...prev,
        assets: { ...prev.assets, assetType: !prev.assets.assetType },
      }));
    } else if (type === 'hasAdvertisement') {
      setVideoData((prev) => ({
        ...prev,
        advertisement: {
          ...prev.advertisement,
          hasAdvertisement: !prev.advertisement.hasAdvertisement,
        },
      }));
    } else if (type === 'hasQuiz') {
      setVideoData((prev) => ({
        ...prev,
        quiz: {
          ...prev.quiz,
          hasQuiz: !prev.quiz.hasQuiz,
        },
      }));
    } else if (type === 'hasSurvey') {
      setVideoData((prev) => ({
        ...prev,
        survey: {
          ...prev.survey,
          hasSurvey: !prev.survey.hasSurvey,
        },
      }));
    }
  };

  const handleVideoInputChange = (e) => {
    setVideoData((prev) => ({
      ...prev,
      video: { ...prev.video, videoFile: e.target.files[0] },
    }));
  };

  const handleAddVideo = (formData) => {
    let data = { ...formData };

    if (videoData.video.videoType) {
      data = {
        ...data,
        videoFile: videoData.video.videoFile,
      };
    }

    if (videoData.assets.hasAssets) {
      data = {
        ...data,
        assetsList: [...videoData.assets.assetsList],
      };
    }

    if (videoData.assets.hasAssets) {
      data = {
        ...data,
        assetsList: [...videoData.assets.assetsList],
      };
    }

    if (videoData.advertisement.hasAdvertisement) {
      data = {
        ...data,
        advertisementList: [...videoData.advertisement.advertisementList],
      };
    }

    if (videoData.quiz.hasQuiz) {
      data = {
        ...data,
        questionsList: [...videoData.quiz.questionsList],
      };
    }

    if (videoData.survey.hasSurvey) {
      data = {
        ...data,
        survey: videoData.survey.survey,
      };
    }

    uploadVideo(data, `courses/${id}/videos`);
  };

  useEffect(() => {
    if (course && !course.videos) {
      dispatch(fetchVideos(id));
    }
  }, [courses, id]);

  return (
    <Box className='main-container'>
      <Box className='flex justify-start items-center gap-4' mb={'5px'}>
        <Text className='font-bold text-primary-600 text-base'>
          Tipo de vídeo:
        </Text>
        <Box className='flex justify-start items-center gap-4'>
          <Switch
            id='videoType'
            onChange={() => handleSwitch('videoType')}
            defaultChecked
          />
          <label htmlFor={'videoType'} className='text-base leading-5'>
            {videoData.video.videoType ? 'Arquivo' : 'URL'}
          </label>
        </Box>
      </Box>
      <form
        onSubmit={handleSubmit(handleAddVideo)}
        id='addVideoForm'
        className='flex flex-col gap-[10px] pt-2 pb-4'
      >
        {videoData.video.videoType ? (
          <Box className='mb-4'>
            <label
              htmlFor={'videoFile'}
              className='text-base leading-5 mb-[9px] block'
            >
              Vídeo
            </label>
            <input
              type='file'
              name='videoFile'
              onChange={handleVideoInputChange}
              multiple={false}
              accept='video/*'
              title='Selecione um vídeo'
              className='w-full outline-none text-base'
            />
          </Box>
        ) : (
          <Input
            theme={'light'}
            type={'text'}
            label={'URL'}
            placeholder={'www.exemplo.com'}
            register={register}
            id={'videoPath'}
            error={errors?.videoPath?.message}
            watch={watch}
          />
        )}
        <Box className='pb-[5px]'>
          <label
            htmlFor={'section'}
            className='text-base leading-5 mb-[9px] block'
          >
            Seção
          </label>
          <select
            id='section'
            {...register('section')}
            className={`w-full rounded-[4px] px-3 py-[5px] leading-5 text-base outline-none bg-white placeholder:text-gray-900 shadow-sm shadow-gray-900/50`}
          >
            {course?.sections?.map((section, i) => (
              <option key={i} value={section.sectionName}>
                {section.sectionName}
              </option>
            ))}
          </select>
        </Box>
        <Input
          theme={'light'}
          type={'number'}
          label={'Ordem'}
          placeholder={'Digite aqui'}
          register={register}
          id={'order'}
          error={errors?.order?.message}
          watch={watch}
        />
        <Input
          theme={'light'}
          type={'text'}
          label={'Título'}
          placeholder={'Digite aqui'}
          register={register}
          id={'title'}
          error={errors?.title?.message}
          watch={watch}
        />
        <Input
          theme={'light'}
          type={'text'}
          label={'Descrição'}
          placeholder={'Digite aqui'}
          register={register}
          id={'description'}
          error={errors?.description?.message}
          watch={watch}
        />
      </form>
      <Box className='flex justify-start items-center gap-4' mb={'5px'}>
        <Text className='font-bold text-primary-600 text-base'>
          Material Complementar
        </Text>
        <Box className='flex justify-start items-center gap-4'>
          <Switch id='hasAssets' onChange={() => handleSwitch('hasAssets')} />
        </Box>
      </Box>
      {videoData.assets.hasAssets && (
        <>
          <Box className='flex justify-start items-center gap-4' my={'16px'}>
            <Text className='font-bold text-primary-600 text-base'>
              Tipo de material:
            </Text>
            <Box className='flex justify-start items-center gap-4'>
              <Switch
                id='assetType'
                onChange={() => handleSwitch('assetType')}
                defaultChecked
              />
              <label htmlFor={'assetType'} className='text-base leading-5'>
                {videoData.assets.assetType ? 'Arquivo' : 'URL'}
              </label>
            </Box>
          </Box>
          <Assets videoData={videoData} setVideoData={setVideoData} />
        </>
      )}
      <Box className='flex justify-start items-center gap-4' my={'16px'}>
        <Text className='font-bold text-primary-600 text-base'>Anúncios</Text>
        <Box className='flex justify-start items-center gap-4'>
          <Switch
            id='hasAdvertisement'
            onChange={() => handleSwitch('hasAdvertisement')}
          />
        </Box>
      </Box>
      {videoData.advertisement.hasAdvertisement && (
        <Advertisement setVideoData={setVideoData} />
      )}
      <Box className='flex justify-start items-center gap-4' my={'16px'}>
        <Text className='font-bold text-primary-600 text-base'>
          Questionário
        </Text>
        <Box className='flex justify-start items-center gap-4'>
          <Switch id='hasQuiz' onChange={() => handleSwitch('hasQuiz')} />
        </Box>
      </Box>
      {videoData.quiz.hasQuiz && <Quiz setVideoData={setVideoData} />}
      <Box className='flex justify-start items-center gap-4' my={'16px'}>
        <Text className='font-bold text-primary-600 text-base'>Enquete</Text>
        <Box className='flex justify-start items-center gap-4'>
          <Switch id='hasSurvey' onChange={() => handleSwitch('hasSurvey')} />
        </Box>
      </Box>
      {videoData.survey.hasSurvey && <Survey setVideoData={setVideoData} />}

      <ButtonSubmit
        form='addVideoForm'
        disabled={false}
        text={'Adicionar'}
        loading={loading}
      />
    </Box>
  );
}
