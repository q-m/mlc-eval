#!/usr/bin/env ruby
#
# Generates predictions and a confusion matrix using cross-validation
#
require 'libsvm'
require 'optparse'

params = Libsvm::SvmParameter.new
params.svm_type = 1
params.kernel_type = 2
params.degree = 3
params.coef0 = 0
params.nu = 0.5
params.c = 1.0
params.gamma = 0
params.cache_size = 100
params.eps = 0.001
params.shrinking = 1
params.probability = 0
nfold = 5

option_parser = OptionParser.new do |opts|
  opts.banner = 'Usage: ruby libsvm-cm.rb [options] training_set_file confusion_matrix_file [results_file]'

  opts.on('-s svm_type', Integer, "set type of SVM (default #{params.svm_type})") do |type|
    params.svm_type = type
  end
  opts.on('-t kernel_type', Integer, "set type of kernel function (default #{params.kernel_type})") do |type|
    params.kernel_type = type
  end
  opts.on('-d degree', Integer, "set degree in kernel function (default #{params.degree})") do |degree|
    params.degree = degree
  end
  opts.on('-g gamma', Float, 'set gamma in kernel function (default 1/num_features)') do |gamma|
    params.gamma = gamma
  end
  opts.on('-r coef0', Float, "set coef0 in kernel function (default #{params.coef0})") do |coef|
    params.coef0 = coef
  end
  opts.on('-c cost', Float, "set the parameter C of C-SVC, epsilon-R and nu-SVR (default #{params.c})") do |cost|
    params.c = cost
  end
  opts.on('-n nu', Float, "set the parameter nu of C-SVC, epsilon-R and nu-SVR (default #{params.nu})") do |nu|
    params.nu = nu
  end
  opts.on('-p epsilon', Float, "set the epsilon in loss of function SVR (default #{params.p})") do |epsilon|
    params.p = epsilon
  end
  opts.on('-m cachesize', Integer, "set cache memory size in MB (default #{params.cache_size})") do |mb|
    params.cache_size = mb
  end
  opts.on('-e epsilon', Float, "set tolerance of termination criterion (default #{params.eps})") do |epsilon|
    params.eps = epsilon
  end
  opts.on('-h shrinking', Integer, "whether to use shrinking heuristics, 0 or 1 (default #{params.shrinking})") do |shrinking|
    params.shrinking = shrinking
  end
  opts.on('-b probability', Integer, "whether to train a SVC or SVR model for probability estimates, 0 or 1 (default #{params.probability})") do |prob|
    params.probability = prob
  end
  opts.on('-v n', Integer, "n-fold cross validation mode (default #{nfold})") do |nfold|
    nfold = nfold
  end
  opts.on('-q', 'quiet mode (no outputs)') do
    Liblinear.quiet_mode
  end
end
option_parser.parse!

training_file, confusion_file, results_file = ARGV[0, 3]
if !training_file || !confusion_file
  puts option_parser.help
  exit 1
end


# Load libsvm problem file, returning labels and features.
def load_problem(filename)
  labels = []
  examples = []
  File.open(filename, 'r') do |f|
    f.each_line do |line|
      fields = line.split
      labels << fields[0].to_i
      examples << Hash[fields[1..-1].map do |s|
        a = s.split(':')
        [a[0].to_i, a[1].to_f]
      end]
    end
  end
  [labels, examples]
end

# Save predictions
def save_results(filename, results)
  File.write(filename, results.map {|p| p.to_i.to_s }.join("\n"))
end

# Save confusion matrix
def save_confusion(filename, labels, results)
  uniq_labels = labels.uniq
  File.open(filename, 'w') do |f|
    # header with predicted categories
    f.puts (['-'] + uniq_labels + ['+']).join(' ')
    # a row for each original category
    vsums = [0] * uniq_labels.length # keep track of vertical sums
    labels.zip(results).group_by {|(label,_)| label }.each do |label, pairs|
      values = uniq_labels.map do |l|
        pairs.select {|(_,v)| v == l}.count
      end
      values.each_with_index {|n,i| vsums[i] += n }
      f.puts ([label] + values + [values.reduce(&:+)]).join(' ')
    end
    # final row with vertical sums
    f.puts (['+'] + vsums + [vsums.reduce(&:+)]).join(' ')
  end
end


labels, examples = load_problem(training_file)
problem = Libsvm::Problem.new
problem.set_examples(labels, examples.map {|a| Libsvm::Node.features(a) })
results = Libsvm::Model.cross_validation(problem, params, nfold)
save_results(results_file, results) if results_file
save_confusion(confusion_file, labels, results) if confusion_file
