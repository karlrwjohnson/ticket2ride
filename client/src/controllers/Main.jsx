import React from 'react';
import {
    root,
} from '../styles/main';
import { Game } from './Game';
import { Header } from '../components/Header';

export default class Main extends React.PureComponent {
    render() {
        return (
            <div className={root}>
                <Header />
                <Game />
            </div>
        );
    }
}
