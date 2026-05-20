import { getAllContributors } from "@/app/actions/client-actions/contributor";
import ContributorListingComponent from "@/components/client-components/contributor-listing";
import Loader from "@/components/client-components/Loader";
import PageGridWrapper from "@/components/client-components/grid-wrapper";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const ContributorsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const params = await searchParams;

  const page = Number(params?.page || 1);

  const result = await getAllContributors({
    page,
    limit: 12,
  });

  return (
    <PageGridWrapper>
      <Suspense fallback={<Loader />}>
        <ContributorListingComponent result={result} />
      </Suspense>
    </PageGridWrapper>
  );
};

export default ContributorsPage;