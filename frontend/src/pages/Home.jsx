import AboutSection from "../component/AboutSection"
import FeaturedListings from "../component/FeaturedListings"
import Footer from "../component/Footer"
import Header from "../component/Header"
import HeroSection from "../component/HeroSection"


const Home = () => {
  return (
    <div>
        <Header />
        <HeroSection />
        <FeaturedListings />
        <AboutSection />
        <Footer />
    </div>
  )
}

export default Home
