type Poptions = {
    page: number | string;
    limit: number | string;
    sortby?: string;
    sortorder?: string;
}

type PaginationResult = {
    page: number;
    limit: number;
    skip: number;
    sortby: string;
    sortorder: string;
}

const paginationHelpers = (options: Poptions) : PaginationResult => {

    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = (page - 1) * limit

    const sortby = options.sortby || 'createdAt';
    const sortorder = options.sortorder || 'desc';

    return {
        page,
        limit,
        skip,
        sortby,
        sortorder
    };
}

export default paginationHelpers;