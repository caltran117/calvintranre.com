feat: integrate idx broker mls widgets into luxury landing page

- Add IDXFeaturedSection component with live MLS property widgets
- Implement Featured Luxury Portfolio slideshow widget (112685) with navigation controls
- Create Luxury Property Collection showcase widget (112683) with grid layout
- Integrate MLS widgets into HomePage after existing FeaturedListings section
- Add professional loading states with blur effects and spinner animations
- Implement error handling with graceful fallbacks and refresh options
- Optimize widget script loading with container-based injection for proper initialization
- Add luxury branding with "EXCLUSIVE MLS PROPERTIES" premium positioning
- Create compact layout design to eliminate excessive white space
- Setup responsive design with mobile-optimized widget containers

Frontend features include:
- IDXFeaturedSection component with dual widget integration following luxury website aesthetic
- Professional loading states with spinning animations and blur transitions during widget initialization
- Container-based script injection matching working IDXBrokerPropertiesPage implementation pattern
- Optimized spacing with reduced padding (py-20 to py-12) and margins for better content density
- Luxury typography with elegant headings and professional section titles
- Framer Motion animations with staggered delays for smooth page transitions
- Error boundary handling with user-friendly refresh options for widget failures

Widget integration includes:
- Featured Slideshow Widget (112685) displaying interactive property carousel with navigation
- Luxury Showcase Widget (112683) providing grid-based property display with details
- Real-time MLS data integration with automatic property updates from Multiple Listing Service
- Professional widget containers with rounded corners and gray background styling
- Smart script cleanup on component unmount to prevent memory leaks and duplicate loading

Homepage enhancement includes:
- Strategic placement after existing FeaturedListings to provide both curated and live property data
- Comprehensive property showcase combining database properties with live MLS listings
- Enhanced call-to-action section linking to exclusive properties page with luxury positioning
- Mobile-responsive design ensuring optimal widget display across all device sizes