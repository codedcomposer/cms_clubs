import React from 'react';
import { Container } from '@components';
import '@styles/components/pages/Home/Events.scss';
import { FormatDate } from '@util';
import { useFetch } from '../../../util/Hooks';

const format = d => d.getWeek(false, ' ').getMonth(false, ' ').getDay(false, ', ').getTime().format();
const dateRange = (from, to) => {
    const f = new FormatDate(from);
    const t = new FormatDate(to);
    return `${format(f)} - ${t.getTime().format()}`;
};

const CALENDAR_URL = encodeURI(
    `https://www.googleapis.com/calendar/v3/calendars/${
    process.env.GATSBY_CALENDAR_ID
    }/events?key=${
    process.env.GATSBY_CALENDAR_KEY
    }`
);

const CONFIG = {
    initState: {},
    requestInit: {
        headers: {
            'Content-Type': 'application/json',
        },
    },
};

export const Events = () => {
    const { data, loading } = useFetch(CALENDAR_URL, CONFIG);

    const renderEvents = () => {
        let filteredEvents = data.items.filter(({ start }) => {
            const d = new Date();
            return new Date(start.dateTime) >= d.setDate(d.getDate() - 1)
        })

        if (filteredEvents.length > 0) {
            return filteredEvents.sort((a, b) => { return new Date(a.start.dateTime) - new Date(b.start.dateTime) })
            .map(({ summary, description, start, end, location, creator }, i) => {
                const [text, groups] = description.split('[[');
                const items = groups ? groups.split(',') : [];
                return (
                    <li
                        className='events__item'
                        key={i}
                    >
                        <div className='events__item-header'>
                            <h3 className='events__item-title'>{summary}</h3>
                            <div className='events__item-info'>
                                <span className='events__item-date'>
                                    {dateRange(start.dateTime, end.dateTime)}&nbsp;
                            </span>
                                <span className='events__item-location'>
                                    {location}
                                </span>
                            </div>
                        </div>
                        <ul className='events__groups'>
                            {
                                items.map((group, j) => (
                                    <li key={j} className='events__group'>
                                        {group}
                                    </li>
                                ))
                            }
                        </ul>
                        <p
                            className='events__item-text'
                            dangerouslySetInnerHTML={{ __html: text.replace(/<br>/g, ' ') }}
                        />
                    </li>
                );
            })
        } else {
            return(<li className='events__loading'>There are no upcoming events. In the meantime, check out our Discord community (links at the bottom)!</li>)
        }
    }

    return (
        <Container tag='section' block='events' className='home__section'>
            <div className='events__header'>
                <h2 className='events__title'>Events</h2>
                <a className='events__link-button'
                    rel='noopener noreferrer' target='_blank' style={{marginRight: '2em'}}
                    href='https://calendar.google.com/calendar/b/2?cid=djJpYzQyb2tjbWZyZjk1NDY4bWd1MmhzOGdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ'
                >
                    Google Calendar
                </a>
                <a className='events__link-button'
                    rel='noopener noreferrer'
                    href='/calendar'
                >
                    More Events
                </a>
            </div>
            <ul className='events__list'>
                {
                    !loading ? (
                        renderEvents()
                    ) : (
                            <li className='events__loading'>Loading...</li>
                        )
                }
            </ul>
        </Container>
    );
};