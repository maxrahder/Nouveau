require "mini_parser"

describe JsDuck::Aggregator do
  def parse(string)
    Helper::MiniParser.parse(string)
  end

  def parse_member(string)
    parse(string)["global"][:members][0]
  end

  describe "normal @static on single method" do
    before do
      @doc = parse_member(<<-EOS)
        /**
         * Some function
         * @static
         */
        function bar() {}
      EOS
    end

    it "labels that method as static" do
      @doc[:static].should == true
    end

    it "doesn't detect inheritable property" do
      @doc[:inheritable].should_not == true
    end
  end

  describe "@static with @inheritable" do
    before do
      @doc = parse_member(<<-EOS)
        /**
         * Some function
         * @static
         * @inheritable
         */
        function bar() {}
      EOS
    end

    it "labels that method as static" do
      @doc[:static].should == true
    end

    it "detects the @inheritable property" do
      @doc[:inheritable].should == true
    end
  end

  describe "@static in class context" do
    before do
      @doc = parse(<<-EOS)["Foo"]
        /**
         * @class Foo
         */
        /**
         * Some function
         * @static
         */
        function bar() {}
        /**
         * Some property
         * @static
         */
        baz = "haha"
      EOS
    end

    it "adds static members to :members" do
      @doc[:members].length.should == 2
    end
  end

  describe "Ext.define() with undocumented property in statics:" do
    let(:member) do
      parse(<<-EOS)["MyClass"][:members][0]
        /**
         * Some documentation.
         */
        Ext.define("MyClass", {
            statics: {
                foo: 42
            }
        });
      EOS
    end

    describe "detects a member" do
      it "with :property tagname" do
        member[:tagname].should == :property
      end

      it "with :static flag" do
        member[:static].should == true
      end

      it "with :autodetected flag" do
        member[:autodetected][:tagname].should == :property
      end

      it "with owner" do
        member[:owner].should == "MyClass"
      end

      it "as private" do
        member[:private].should == true
      end

      it "with :linenr field" do
        member[:linenr].should == 6
      end
    end
  end

  describe "Ext.define() with documented method in statics:" do
    let(:member) do
      parse(<<-EOS)["MyClass"][:members][0]
        /**
         * Some documentation.
         */
        Ext.define("MyClass", {
            statics: {
                /** Docs for bar */
                bar: function() {}
            }
        });
      EOS
    end

    describe "detects a member" do
      it "with :method tagname" do
        member[:tagname].should == :method
      end

      it "with :static flag" do
        member[:static].should == true
      end

      it "with docs" do
        member[:doc].should == "Docs for bar"
      end

      it "with owner" do
        member[:owner].should == "MyClass"
      end

      it "as public" do
        member[:private].should_not == true
      end

      it "with :linenr field" do
        member[:files][0][:linenr].should == 6
      end
    end
  end

  describe "Ext.define() with undocumented method in inheritableStatics:" do
    let(:member) do
      parse(<<-EOS)["MyClass"][:members][0]
        /**
         * Some documentation.
         */
        Ext.define("MyClass", {
            inheritableStatics: {
                bar: function() {}
            }
        });
      EOS
    end

    describe "detects a member" do
      it "with :method tagname" do
        member[:tagname].should == :method
      end

      it "with :static flag" do
        member[:static].should == true
      end

      it "with :inheritable flag" do
        member[:inheritable].should == true
      end

      it "with :inheritdoc flag" do
        member[:inheritdoc].should == {}
      end
    end
  end

  describe "Ext.define() with line-comment before item in statics:" do
    let(:member) do
      parse(<<-EOS)["MyClass"][:members][0]
        /**
         * Some documentation.
         */
        Ext.define("MyClass", {
            statics: {
                // Check this out
                bar: function() {}
            }
        });
      EOS
    end

    it "detects a static" do
      member[:static].should == true
    end

    it "detects a method" do
      member[:tagname].should == :method
    end

    it "detects documentation" do
      member[:doc].should == "Check this out"
    end

    it "detects the method with :autodetected flag" do
      member[:autodetected][:tagname].should == :method
    end
  end

  describe "Ext.define() with property having value Ext.emptyFn in statics:" do
    let(:member) do
      parse(<<-EOS)["MyClass"][:members][0]
        /**
         * Some documentation.
         */
        Ext.define("MyClass", {
            statics: {
                bar: Ext.emptyFn
            }
        });
      EOS
    end

    it "detects a static" do
      member[:static].should == true
    end

    it "detects a method" do
      member[:tagname].should == :method
    end
  end

end
