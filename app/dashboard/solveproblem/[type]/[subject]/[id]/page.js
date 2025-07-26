// app/dashboard/solveproblem/[subject]/[id]/page.js
'use client';
import React from 'react';
import useSWR from 'swr';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import ChooseQuestion from '@/components/dashboard/solveproblem/ChooseQuesiton';
import QuesitonLoading from '@/components/dashboard/question/QuestionLoading';
const fetcher = (url) => fetch(url).then((res) => res.json());

function Page() {
  const params = useParams();
  const type = params.type;
  const chapterId = params?.id; // 'id' is actually chapterId here
  const subject = params?.subject;

  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '0', 10);
  
  const { data, error, isLoading } = useSWR(
    chapterId ? `/api/subject/chapter?chapterId=${chapterId}&type=${type}&page=${page}` : null,
    fetcher
  );



  if (error) return <div> Failed to load</div>;
  if (isLoading || !data) return <QuesitonLoading  />;

  return (
    <div className="px-6 pb-6 text-foreground font-puritan">
      <ChooseQuestion page={page} chapterId={chapterId} data={data} />




    </div>


  );
}

export default Page;
