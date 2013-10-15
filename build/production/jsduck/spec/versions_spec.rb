require "jsduck/process/versions"
require "jsduck/util/null_object"
require "jsduck/class"

describe JsDuck::Process::Versions do

  def current_version
    JsDuck::Util::NullObject.new(:[] => JsDuck::Util::NullObject.new(:[] => true))
  end

  describe "without :new_since option" do
    before do
      @versions = [
        {
          :version => "1.0", :classes => {
            "VeryOldClass" => {"cfg-foo" => true},
            "ExplicitNewClass" => {},
          },
        },
        {
          :version => "2.0", :classes => {
            "VeryOldClass" => {"cfg-foo" => true, "cfg-bar" => true},
            "OldClass" => {},
            "ClassWithOldName" => {},
          },
        },
        {
          :version => "3.0", :classes => current_version
        }
      ]

      importer = JsDuck::Util::NullObject.new(:import => @versions)

      @relations = [
        {:name => "VeryOldClass", :alternateClassNames => [], :members => [
            {:tagname => :cfg, :id => "cfg-foo"},
            {:tagname => :cfg, :id => "cfg-bar"},
            {:tagname => :cfg, :id => "cfg-baz"},
            {:tagname => :cfg, :id => "cfg-zap", :since => "1.0"},
            {:tagname => :cfg, :id => "cfg-new", :new => true},
          ]},
        {:name => "OldClass", :alternateClassNames => []},
        {:name => "NewClass", :alternateClassNames => []},
        {:name => "ClassWithNewName", :alternateClassNames => ["ClassWithOldName"]},
        {:name => "ExplicitSinceClass", :since => "1.0", :alternateClassNames => []},
        {:name => "ExplicitNewClass", :new => true, :alternateClassNames => []},
      ].map {|cfg| JsDuck::Class.new(cfg) }

      JsDuck::Process::Versions.new(@relations, {:imports => @versions}, importer).process_all!

      # build className/member index for easy lookup in specs
      @stuff = {}
      @relations.each do |cls|
        @stuff[cls[:name]] = cls
        cls[:members].each do |cfg|
          @stuff[cls[:name]+"#"+cfg[:id]] = cfg
        end
      end
    end

    # @since

    it "adds @since 1.0 to VeryOldClass" do
      @stuff["VeryOldClass"][:since].should == "1.0"
    end

    it "adds @since 2.0 to OldClass" do
      @stuff["OldClass"][:since].should == "2.0"
    end

    it "adds @since 3.0 to NewClass" do
      @stuff["NewClass"][:since].should == "3.0"
    end

    it "adds @since 2.0 to ClassWithNewName" do
      @stuff["ClassWithNewName"][:since].should == "2.0"
    end

    it "doesn't override explicit @since 1.0 in ExplicitSinceClass" do
      @stuff["ExplicitSinceClass"][:since].should == "1.0"
    end

    it "adds @since 1.0 to #foo" do
      @stuff["VeryOldClass#cfg-foo"][:since].should == "1.0"
    end

    it "adds @since 2.0 to #bar" do
      @stuff["VeryOldClass#cfg-bar"][:since].should == "2.0"
    end

    it "adds @since 3.0 to #baz" do
      @stuff["VeryOldClass#cfg-baz"][:since].should == "3.0"
    end

    it "doesn't override explicit @since 1.0 in #zap" do
      @stuff["VeryOldClass#cfg-zap"][:since].should == "1.0"
    end

    # @new

    it "doesn't add @new to VeryOldClass" do
      @stuff["VeryOldClass"][:new].should_not == true
    end

    it "doesn't add @new to OldClass" do
      @stuff["OldClass"][:new].should_not == true
    end

    it "adds @new to NewClass" do
      @stuff["NewClass"][:new].should == true
    end

    it "doesn't add @new to ClassWithNewName" do
      @stuff["ClassWithNewName"][:new].should_not == true
    end

    it "doesn't add @new to ExplicitSinceClass" do
      @stuff["ExplicitSinceClass"][:new].should_not == true
    end

    it "keeps explicit @new on ExplicitNewClass" do
      # Though it seems like a weird case, there could be a situation
      # where 1.0 had class Foo, which was removed in 2.0, but in 3.0 a
      # completely unrelated Foo class was introduced.
      @stuff["ExplicitNewClass"][:new].should == true
    end

    it "doesn't add @new to #foo" do
      @stuff["VeryOldClass#cfg-foo"][:new].should_not == true
    end

    it "doesn't add @new to #bar" do
      @stuff["VeryOldClass#cfg-bar"][:new].should_not == true
    end

    it "adds @new to #baz" do
      @stuff["VeryOldClass#cfg-baz"][:new].should == true
    end

    it "doesn't add @new to #zap" do
      @stuff["VeryOldClass#cfg-zap"][:new].should_not == true
    end

    it "keeps explicit @new in #new" do
      @stuff["VeryOldClass#cfg-new"][:new].should == true
    end

  end

  describe "with explicit :new_since option" do
    before do
      @versions = [
        {
          :version => "1.0", :classes => {
            "VeryOldClass" => {},
          },
        },
        {
          :version => "2.0", :classes => {
            "OldClass" => {},
          },
        },
        {
          :version => "3.0", :classes => current_version
        }
      ]
      importer = JsDuck::Util::NullObject.new(:import => @versions)

      @relations = [
        {:name => "VeryOldClass", :alternateClassNames => []},
        {:name => "OldClass", :alternateClassNames => []},
        {:name => "NewClass", :alternateClassNames => []},
      ].map {|cfg| JsDuck::Class.new(cfg) }

      JsDuck::Process::Versions.new(@relations, {:imports => @versions, :new_since => "2.0"}, importer).process_all!
    end

    # @since

    it "gives no @new to VeryOldClass" do
      @relations[0][:new].should_not == true
    end

    it "gives @new to OldClass" do
      @relations[1][:new].should == true
    end

    it "gives no @new to NewClass" do
      @relations[2][:new].should == true
    end
  end

end
