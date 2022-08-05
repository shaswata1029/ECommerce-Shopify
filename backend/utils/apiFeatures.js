class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    console.log(keyword);
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    let queryCopy = { ...this.queryStr };
    // console.log(queryCopy);
    // Removing fields for category
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    //Filter for price and rating

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|lt|gte|lte)\b/g, (key) => `$${key}`);
    queryCopy = JSON.parse(queryStr);
    // console.log(queryCopy);

    this.query = this.query.find(queryCopy);
    return this;
  }

  pagination(resultPerPage) {
    let currentPage = Number(this.queryStr.page || 1);
    let skipPages = Number(resultPerPage * (currentPage - 1));
    this.query.limit(resultPerPage).skip(skipPages);
    return this;
  }
}

module.exports = ApiFeatures;
