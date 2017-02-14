#!/usr/bin/env ruby
#
# Generates predictions and a confusion matrix using cross-validation
#
require 'liblinear'
require 'optparse'

params = {}
nfold = 5

option_parser = OptionParser.new do |opts|
  opts.banner = 'Usage: ruby liblinear-cm.rb [options] training_set_file confusion_matrix_file [results_file]'

  opts.on('-s type', Integer, 'set type of solver (default 1)') do |type|
    params[:solver_type] = type
  end
  opts.on('-c cost', Float, 'set the parameter C (default 1)') do |cost|
    params[:cost] = cost
  end
  opts.on('-p epsilon', Float, 'set the epsilon in loss of function SVR (default 0.1)') do |epsilon|
    params[:sensitive_loss] = epsilon
  end
  opts.on('-e epsilon', Float, 'set tolerance of termination criterion') do |epsilon|
    params[:epsilon] = epsilon
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
results = Liblinear.cross_validation(nfold, cfg, labels, examples)
save_results(results_file, results) if results_file
save_confusion(confusion_file, labels, results) if confusion_file

