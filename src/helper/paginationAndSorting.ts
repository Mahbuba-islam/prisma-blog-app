
type Ioptions = {
    page?:number | undefined
    limit?:number | undefined
    sortBy?:string | undefined
    sortOrder?:string | undefined
}

type IoptionsResults = {
     page:number 
    limit:number
    sortBy:string
    sortOrder:string
    skip:number 
}

const sortingAndPagination = (options:Ioptions) : IoptionsResults => {
  console.log(options);
  const page = Number(options.page) | 1
  const limit = Number(options.limit) | 5
  
 const skip = Number(page - 1)*limit
  
 const sortBy = options.sortBy || "createdAt";
 const sortOrder = options.sortOrder || "desc"

 return {
  page, limit, skip, sortBy, sortOrder
 }


  
}


export default sortingAndPagination