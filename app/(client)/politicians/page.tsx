import { getAllPoliticians } from "@/app/actions/client-actions/politician";
import PoliticianListingComponent from "@/components/client-components/politician-listing";
import Loader from "@/components/client-components/Loader";
import PageGridWrapper from "@/components/client-components/grid-wrapper";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const PoliticiansPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const params = await searchParams;

  const page = Number(params?.page || 1);

  const result = await getAllPoliticians({
    page,
    limit: 12,
  });

  return (
    <PageGridWrapper>
      <Suspense fallback={<Loader />}>
        <PoliticianListingComponent result={result} />
      </Suspense>
    </PageGridWrapper>
  );
};

export default PoliticiansPage;