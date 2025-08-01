import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const generatePageNumbers = (currentPage, totalPages) => {
  const pageNumbers = [];
  const delta = 1; // Number of pages to show around the current page

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // Always show the first page
      i === totalPages || // Always show the last page
      (i >= currentPage - delta && i <= currentPage + delta) // Show around current page
    ) {
      pageNumbers.push(i);
    } else if (
      pageNumbers[pageNumbers.length - 1] !== "..." // Add ellipsis only once
    ) {
      pageNumbers.push("..."); // Add ellipsis
    }
  }

  return pageNumbers;
};

const PaginationWithEllipsis = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  return (
    <Pagination className="flex flex-wrap justify-center items-center space-x-1 sm:space-x-2">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href="javascript:void(0)"
              onClick={() => onPageChange(currentPage - 1)}
            />
          </PaginationItem>
        )}

        {pageNumbers.map((page, index) =>
          page === "..." ? (
            // Use a unique key for ellipsis by appending the index
            <PaginationEllipsis key={`ellipsis-${index}`} />
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="javascript:void(0)"
                onClick={() => onPageChange(page)}
                className={`sm:w-9 w-5 ${page === currentPage ? "font-bold" : "text-muted-foreground"}`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href="javascript:void(0)"
              onClick={() => onPageChange(currentPage + 1)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationWithEllipsis;
