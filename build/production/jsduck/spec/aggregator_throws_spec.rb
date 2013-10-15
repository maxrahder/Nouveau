require "mini_parser"

describe JsDuck::Aggregator do
  def parse(string)
    Helper::MiniParser.parse(string)
  end

  def parse_member(string)
    parse(string)["global"][:members][0]
  end

  describe "@throws with type and description" do
    before do
      @doc = parse_member(<<-EOS)
        /**
         * Some function
         * @throws {Error} Some text
         * on multiple lines.
         */
        function bar() {}
      EOS
    end

    it "detects one throws tag" do
      @doc[:throws].length.should == 1
    end

    it "detects type of exception" do
      @doc[:throws][0][:type].should == "Error"
    end

    it "detects description" do
      @doc[:throws][0][:doc].should == "Some text\non multiple lines."
    end

    it "leaves documentation after @throws out of the main documentation" do
      @doc[:doc].should == "Some function"
    end
  end

  describe "@throws without type" do
    before do
      @doc = parse_member(<<-EOS)
        /**
         * @throws Some description
         */
        function bar() {}
      EOS
    end

    it "detects type as Object" do
      @doc[:throws][0][:type].should == "Object"
    end

    it "detects description" do
      @doc[:throws][0][:doc].should == "Some description"
    end
  end

  describe "multiple @throws" do
    before do
      @doc = parse_member(<<-EOS)
        /**
         * @throws {Error} first
         * @throws {Error} second
         */
        function bar() {}
      EOS
    end

    it "detects two throws tags" do
      @doc[:throws].length.should == 2
    end
  end

end
