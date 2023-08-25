module Jekyll
  class CopyThemeAssets < Generator
    priority :lowest

    def generate(site)
      # Check if the build environment is set to 'production'
      if site.config['jekyll']['environment'] == 'production'
        # Retrieve the theme's assets directory path
        theme_assets_dir = File.join(site.theme.root, "assets") # Adjust the path to match your theme's assets directory

        # Set the destination directory for copying assets
        destination_dir = File.join(site.dest, "../assets")

        # Create the destination directory if it doesn't exist
        FileUtils.mkdir_p(destination_dir)

        # Check if the assets have already been copied
        return if assets_copied?(destination_dir)

        # Copy the theme's CSS folder to the destination directory
        css_source_dir = File.join(theme_assets_dir, "css")
        css_destination_dir = File.join(destination_dir, "css")
        FileUtils.cp_r(css_source_dir, css_destination_dir)

        # Copy the theme's JS folder to the destination directory
        js_source_dir = File.join(theme_assets_dir, "js")
        js_destination_dir = File.join(destination_dir, "js")
        FileUtils.cp_r(js_source_dir, js_destination_dir)

        # Create a flag file to indicate that the assets have been copied
        create_flag_file(destination_dir)
      end
    end

    private

    def assets_copied?(destination_dir)
      flag_file = File.join(destination_dir, ".assets_copied")
      File.exist?(flag_file)
    end

    def create_flag_file(destination_dir)
      flag_file = File.join(destination_dir, ".assets_copied")
      File.open(flag_file, 'w') {}
    end
  end
end
