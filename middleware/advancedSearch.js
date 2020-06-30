const advancedSearch = (model, populate) => async (req, res, next) => {
  let query;
  // copy query string
  const reqQuery = {
    ...req.query
  };
  // FIeld will exclude
  const removeFields = ['select', 'sort', 'page', 'limit']
  // loop over removedFields aand delete from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);


  let queryStr = JSON.stringify(reqQuery)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
  query = model.find(JSON.parse(queryStr));

  // select FIeld
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);

  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);

  } else {
    query = query.sort('-createdAt')
  }

  // page specific and default
  const page = parseInt(req.query.page, 10) || 1;

  // limit per halaman ex: 3 per page
  const limit = parseInt(req.query.limit, 10) || 10;
  const indexPage = (page - 1) * limit;
  const endpage = page * limit;
  const total = await model.countDocuments();

  query = query.skip(indexPage).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }
  // Executing query
  const results = await query;

  // pagination result
  pagination = {};
  if (endpage < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }
  if (indexPage > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }
  res.advancedSearch = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }
  next();
};
module.exports = advancedSearch;