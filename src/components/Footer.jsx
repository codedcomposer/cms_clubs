import React, { memo } from 'react';
import { Container } from '.';
import { FaGithub, FaFacebook, FaYoutube, FaUsers, FaDiscord, FaEnvelope, FaMobile } from 'react-icons/fa';
import '@styles/components/Footer.scss';
import { Link, useStaticQuery, graphql } from 'gatsby';

const Icons = { FaGithub, FaFacebook, FaYoutube, FaUsers, FaDiscord, FaEnvelope, FaMobile };

const query = graphql`
{
    nav: allNavigationJson {
        nodes {
            name
            path
        }
    }
    media: allMediaJson {
        nodes {
            text
            icon
            link
        }
    }
}
`;

export const Footer = memo(() => {

    const { nav, media } = useStaticQuery(query);
    const [ first, others ] = nav.nodes.reduce((acc, curr) => {
        acc[curr.menu ? 1: 0].push(curr);
        return acc;
    }, [[], []]);

    return (
        <Container tag='footer' block='footer'>
            <div className='footer__row footer__row--main'>
                <div className='footer__content'>
                    <h2 className='footer__title'>CMSClubs</h2>
                    <p className='footer__text'>
                        <span>1095 Military Trail</span> 
                        <span>Toronto, ON</span>
                        <span>M1C 1A4</span>
                    </p>
                    <ul className='footer__media'>
                        {
                            media.nodes.map(({ text, icon, link }, i) => {
                                const Icon = Icons[icon];
                                return (
                                    <li key={ i } className='footer__media-item'>
                                        <a className='footer__link' href={ link } target='_blank' rel='noopener noreferrer'>
                                            <Icon alt={`${ text } link`} className='footer__media-icon'/>
                                        </a>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
                <div className='footer__menu'>
                    <h3 className='footer__menu-title'>Pages</h3>
                    <ul className='footer__menu-list'>
                    {
                        first.map(({ name, path }, i) => (
                            <li key={ i } className='footer__menu-item'>
                                <Link className='footer__link' to={ path }>{ name }</Link>
                            </li>
                        ))
                    }
                    </ul>
                </div>
                {
                    others.map(({ name, menu }, i) => (
                        <div key={ i } className='footer__menu'>
                            <h3 className='footer__menu-title'>{ name }</h3>
                            <ul className='footer__menu-list'>
                                {
                                    menu.map((item, j) => (
                                        <li key={ j } className='footer__menu-item'>
                                            <Link className='footer__link' to={ item.path }>
                                                { item.name }
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    ))
                }
            </div>
            <div className='footer__row footer__row--aside'>
                <p className='footer__aside footer__aside--push'>© CSEC Development Team 2019. All Rights Reserved</p>
                <p className='footer__aside'>
                    Made by Frederic Pun <span role='img' aria-label='Shiba Inu Emoji'>🐕</span> &amp; Kevin Shen <span role='img' aria-label='House Cat Emoji'>🐧</span>
                </p>
            </div>
        </Container>
    );
});