require "mini_parser"

describe JsDuck::Aggregator do
  def parse(string)
    Helper::MiniParser.parse(string)
  end

  def parse_member(string)
    parse(string)["global"][:members][0]
  end

  describe "Property with @readonly" do
    let(:doc) do
      parse_member("/** @readonly */")
    end

    it "gets readonly attribute" do
      doc[:readonly].should == true
    end
  end

  describe "Object.defineProperty with writable:true" do
    let(:doc) do
      parse_member(<<-EOS)
        /**  */
        Object.defineProperty(this, 'myCfg', {
            value: 5,
            writable: true
        });
      EOS
    end

    it "doesn't get readonly attribute" do
      doc[:readonly].should_not == true
    end
  end

  describe "Object.defineProperty with writable:false" do
    let(:doc) do
      parse_member(<<-EOS)
        /**  */
        Object.defineProperty(this, 'myCfg', {
            value: 5,
            writable: false
        });
      EOS
    end

    it "gets readonly attribute" do
      doc[:readonly].should == true
    end
  end

  describe "Object.defineProperty without writable:" do
    let(:doc) do
      parse_member(<<-EOS)
        /**  */
        Object.defineProperty(this, 'myCfg', {
            value: 5
        });
      EOS
    end

    it "gets readonly attribute" do
      doc[:readonly].should == true
    end
  end

  describe "Object.defineProperty with only getter" do
    let(:doc) do
      parse_member(<<-EOS)
        /**  */
        Object.defineProperty(this, 'myCfg', {
            get: function() { return 1; }
        });
      EOS
    end

    it "gets a readonly attribute" do
      doc[:readonly].should == true
    end
  end

  describe "Object.defineProperty with only setter" do
    let(:doc) do
      parse_member(<<-EOS)
        /**  */
        Object.defineProperty(this, 'myCfg', {
            set: function(x) { this.x = x; }
        });
      EOS
    end

    it "gets no readonly attribute" do
      doc[:readonly].should_not == true
    end
  end

  describe "Object.defineProperty with both getter and setter" do
    let(:doc) do
      parse_member(<<-EOS)
        /**  */
        Object.defineProperty(this, 'myCfg', {
            get: function() { return 1; },
            set: function(x) { this.x = x; }
        });
      EOS
    end

    it "gets no readonly attribute" do
      doc[:readonly].should_not == true
    end
  end

end
