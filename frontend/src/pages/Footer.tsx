import '../App.css'
import style from './styles/footer.module.css'

import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import GitHubIcon from '@mui/icons-material/GitHub'

function Footer() {
  return (
    <div className={style.footer_div}>
      <footer className={style.footer}>
        <div className={style.footer_logo}>
          <img src="../../../public/images/Logo2.svg" alt="" />
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus quod veniam quia
            error doloribus sequi alias nam saepe, omnis totam.
          </p>
        </div>

        <ul className={style.footer_contanier_up}>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Products</a>
          </li>
          <li>
            <a href="#">About us</a>
          </li>
          <li>
            <a href="#">Contact us</a>
          </li>
          <li>
            <a href="#">Blog</a>
          </li>
        </ul>

        <ul className={style.footercontanier}>
          <li>
            <a href="#">
              <InstagramIcon />
            </a>
          </li>
          <li>
            <a href="#">
              <LinkedInIcon />
            </a>
          </li>
          <li>
            <a href="#">
              <TwitterIcon />
            </a>
          </li>
          <li>
            <a href="#">
              <GitHubIcon />
            </a>
          </li>
        </ul>
      </footer>
    </div>
  )
}

export default Footer
