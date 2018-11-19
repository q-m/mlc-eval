# MLC-Eval

**A user-interface for evaluation of classification results.**

When working with classification in machine learning, evaluation of results can be very
useful to check and improve. For larger datasets, existing tools remain limited.
This project provides a web-based user-interface for looking into classification results,
which should also work with thousands of classes.

The initial focus was on [LIBSVM][] and [LIBLINEAR][], which provide a convenient way to work
with [support vector machines](https://en.wikipedia.org/wiki/Support_vector_machine) on
large datasets, but other software and methods are also supported (as long as the relevant
files are generated).

Visit the [online app](https://developers.thequestionmark.org/mlc-eval/) directly.


# Features

This project isn't fully complete in the sense that there's more useful information to
show. But it provides a starting point with a summary, category overview and [Confusion matrix][].

![](screenshots.gif)

By default, the widely used iris dataset will be shown. It isn't a very good example to showcase
this tool, with just three classes. To load your own dataset, put your own `data.cm` and other files
in `public/data/`, and add `?baseUrl=/data/data` to the url.

If you want to view data behind the training features in `data.features`, you can use the first
column in that file to indicate an id. Supply a query parameter `itemUrlTemplate=http://.../:id`
to this web application, and the _Categories_ view will show a link in the _Training features_
pane. You can use this to improve your training data, for example.

# Run

The easiest way would be to visit the [hosted app](https://developers.thequestionmark.org/mlc-eval/) directly.

To run this tool yourself, you'll need [Node.js][] to run the web application. For generating the
confusion matrix for LIBSVM/LIBLINEAR (see below), you need [Ruby][].

To run the web application yourself:
```
$ npm install
$ npm start
```

A web browser window will open on `http://localhost:3000/` .


# Files

Classification data is read from the following files, currently served from `public/data/`:

- `data.cm` - confusion matrix
- `data.labels` - label names, to show class names instead of numbers _(optional but recommended)_
- `data.model` - the trained model, only the header is read to show properties _(optional)_
- `data.features` - training data features, for showing data behind trained classes _(optional)_

These files need to be created by your classification software. [LIBSVM][] generates `data.model`,
a tool for generating the confusion matrix is part of this project (see below). See [file formats](#file-formats)
below for an explanation (as well as the example in `public/example`).

## Generating a confusion matrix for SVM

A confusion matrix can be generated after doing cross-validation on the training data.
This can be done with the supplied scripts `libsvm-cm.rb` or `liblinear-cm.rb` (you'll need [Ruby][]).
Options are the same as for `svm-train` or `liblinear-train`.

```
$ gem install rb-libsvm
$ ruby libsvm-cm.rb public/example/data.train public/example/data.cm
```

or

```
$ gem install liblinear-ruby
$ ruby liblinear-cm.rb public/example/data.train public/example/data.cm
```

### File formats

#### `data.cm`

For reference, the confusion matrix file used here has the following format. Consider four
classes, `1`, `2`, `3` and `4`, with 6 training items each. Predictions are on the x-axis,
actual classes are on the y-axis. First line and first column are headers.
Sums for each line and column are at right and bottom.

    - 1 2 3 4 +
    1 5 0 0 1 6
    2 1 4 1 0 6
    3 0 0 4 2 6
    4 1 0 2 3 6
    + 7 4 7 6 24

#### `data.labels`

Consists of class labels in numeric format and their human-readable representation.

    1 Setosa
    2 Versicolour
    3 Virginica

#### `data.model`

The header of this file consists of parameters, which are shown as summary. A line
containing `SV` indicates the last line. A LIBSVM model file follows this format,
but other software could generate this (without model data) to show parameters.

#### `data.features`

Each line of this file contains a training item, with an item id, true class
and the predicted class; the remainder of the line is a text-representation
of the item's features.

For example, the following line is for a training item with id 1337, has class
number 5, the predicted class is 6, and the features are `guide` and `galaxy`

    1337 5 6 guide galaxy

In this case, the algorithm is likely using a bag of words, so it makes sense
to just list the words extracted from the training source data. This is likely
to be different for other classification problems.

The `id` is there to link to the source data, so that you can see where feature extraction
may need to be improved. The placeholder `:id` in the `itemUrlTemplate` query parameter
will be substituted by this number for each item in the _Categories_ view.

# Roadmap

- include example data
- allow loading of remote urls
- allow browsing and loading of local files
- add more metrics, also for each class

# [License](LICENSE.md)

[LIBSVM]: https://www.csie.ntu.edu.tw/~cjlin/libsvm/
[LIBLINEAR]: https://www.csie.ntu.edu.tw/~cjlin/liblinear/
[Confusion matrix]: https://en.wikipedia.org/wiki/Confusion_matrix
[Node.js]: https://nodejs.org/
[Ruby]: http://www.ruby-lang.org/
