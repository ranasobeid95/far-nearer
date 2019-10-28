const reportBuilding = require('../../models/queries/emptyBuildings');
const { schemaBuildings } = require('../../validation');

const postEmptyBuilding = async (req, res, next) => {
  try {
    const newBuild = await schemaBuildings.validate(req.body, {
      abortEarly: false,
    });
    const { thumbnail } = newBuild;
    const picture = Date.now() + thumbnail;
    newBuild.thumbnail = picture;
    await reportBuilding(newBuild);
    res.status(201).send({
      statusCode: 201,
      message: 'Empty building was added successfully',
      data: { newBuild },
    });
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).send({ statusCode: 400, error: error.errors });
    else next(error);
  }
};

module.exports = postEmptyBuilding;
