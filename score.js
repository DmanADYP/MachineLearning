//var _ = require("lodash");

//const predicationPoint = 300;
//const k = 3;
const outputs = [];
const testSetSize = 10;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function distance(pointA, pointB) {
  // const values = Math.abs(pointA - pointB);
  // return values;
  //refactored pythagrum therum
  const values =
    _.chain(pointA)
      .zip(pointB)
      .map(([a, b]) => (a - b) ** 2) //**is the square  */
      .sum()
      .value() ** 0.5;
  return values;
}

function runAnalysis() {
  // const [testSet, traingingSet] = splitDataset(minMax(outputs, 3), testSetSize);
  // let numberCorrect = 0;

  // for (let i = 0; i < testSet.length; i++) {
  //   const bucket = knn(traingingSet, testSet[i][0]);
  //   //testSet[i][3] is the actual bucket it fell into
  //   if (bucket == testSet[i][3]) {
  //     numberCorrect++;
  //   }
  // }
  //  console.log("accuracy", numberCorrect / testSetSize);

  _.range(0, 3).forEach(feature => {
    const data = _.map(outputs, row => [row[feature], _.last(row)]);
    const [testSet, traingingSet] = splitDataset(minMax(data, 1), testSetSize);
    const accuracy = _.chain(testSet)
      .filter(
        testPoint =>
          knn(traingingSet, _.initial(testPoint), feature) ==
          testPoint[_.last(testPoint)]
      )
      .size()
      .divide(testSetSize)
      .value();
    console.log(`for feature of ${feature} has accuracy of ${accuracy}`);
  });
  // _.range(1, 20).forEach(k => {
  //   const accuracy = _.chain(testSet)
  //     .filter(
  //       testPoint => knn(traingingSet, _.initial(testPoint), k) == testPoint[3]
  //     )
  //     .size()
  //     .divide(testSetSize)
  //     .value();
  //   console.log(`for k of ${k} has accuracy of ${accuracy}`);
  // });
}

function knn(data, point, k) {
  //point has 3 values
  const dataSet = _.chain(data)
    .map(row => {
      return [distance(_.initial(row), point), _.last(row)];
    })
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();

  return dataSet;
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const traingingSet = _.slice(shuffled, testCount);
  return [testSet, traingingSet];
}
//featurCount columns of data to normalize
function minMax(data, featureCount) {
  const cloneData = _.cloneDeep(data);

  for (let i = 0; i < featureCount; i++) {
    const column = cloneData.map(row => row[i]);
    const min = _.min(column);
    const max = _.max(column);
    for (let j = 0; j < cloneData.length; j++) {
      cloneData[j][i] = (cloneData[j][i] - min) / (max - min);
    }
  }
  return cloneData;
}
