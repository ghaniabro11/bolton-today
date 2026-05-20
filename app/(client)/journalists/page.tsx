import { getAllJournalists } from "@/app/actions/client-actions/journalist";
import JournalistListingComponent from "@/components/client-components/journalist-listing";
import Loader from "@/components/client-components/Loader";
import PageGridWrapper from "@/components/client-components/grid-wrapper";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const JournalistsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const params = await searchParams;

  const page = Number(params?.page || 1);

  const result = await getAllJournalists({
    page,
    limit: 12,
  });

  return (
    <PageGridWrapper>
      <Suspense fallback={<Loader />}>
        <JournalistListingComponent result={result} />
      </Suspense>
    </PageGridWrapper>
  );
};

export default JournalistsPage;