import '../styles/Header.css';

import logoImage from '../assets/logo.png';
import githubImage from '../assets/GitHub-Mark-Light-120px-plus.png';

export default function Header() {
    return (
        <header>
            <a className="header-title" href="/">
                <img className="header-img" src={logoImage} alt="Chat Bubble"/>
                hermes
            </a>
            <a href="https://github.com/Angoooose/hermes" target="_blank" rel="noreferrer" className="header-link">
                <img className="header-img github-img" src={githubImage} alt="Github"/>
            </a>
        </header>
    );
}