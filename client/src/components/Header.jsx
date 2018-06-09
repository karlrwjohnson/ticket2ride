import React from 'react';
import { header, pageTitle, flexSpacer } from '../styles/main.scss';

export class Header extends React.Component {
    render() {
        return (
            <header className={header}>
                <div className={pageTitle}>Space Traders</div>
                <div className={flexSpacer} />
                <div>John Smith</div>
            </header>
        );
    }
}
