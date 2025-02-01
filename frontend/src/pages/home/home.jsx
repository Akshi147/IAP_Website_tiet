import  Hero  from "../../components/hero/hero"
import Panels from "./components/panel"
import styles from "./home.module.css"
import Navbar from "../../components/navbar/navbar"

const Home = () => {
  return (
    <>
      <Navbar />
    <div className={styles.home}>
      <Hero />
      <main className={styles.main}>
        <h1 className={styles.heading}>6 MONTH PROJECT SEMESTER</h1>
        <p className={styles.title}>Welcome to online module for evaluation</p>
        <Panels />
      </main>
    </div>
    </>
  )
}

export default Home;