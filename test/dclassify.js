 // module dependencies
 var dclassify = require('dclassify');

 // Utilities provided by dclassify
 var Classifier = dclassify.Classifier;
 var DataSet    = dclassify.DataSet;
 var Document   = dclassify.Document;
 
 // create some 'bad' test items (name, array of characteristics)
 var item1 = new Document('item1', ['a','b','c']);
 var item2 = new Document('item2', ['a','b','c']);
 var item3 = new Document('item3', ['a','d','e']);

 // create some 'good' items (name, characteristics)
 var itemA = new Document('itemA', ['c', 'd']);
 var itemB = new Document('itemB', ['e']);
 var itemC = new Document('itemC', ['b','d','e']);

 // create a DataSet and add test items to appropriate categories
 // this is 'curated' data for training
 var data = new DataSet();
 data.add('bad',  [item1, item2, item3]);    
 data.add('good', [itemA, itemB, itemC]);
 
 // an optimisation for working with small vocabularies
 var options = {
     applyInverse: true
 };
 
 // create a classifier
 var classifier = new Classifier(options);
 
 // train the classifier
 classifier.train(data);
 console.log('Classifier trained.');
 console.log(JSON.stringify(classifier.probabilities, null, 4));
 
 // test the classifier on a new test item
 var testDoc = new Document('testDoc', ['b','d', 'e']);    
 var result1 = classifier.classify(testDoc);
 console.log(result1);