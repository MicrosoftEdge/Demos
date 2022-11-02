import React from 'react';
import './App.css';

interface IStatusMessageProps {
    message: string;
}

interface IState {
}

class StatusMessage extends React.Component<IStatusMessageProps, IState> {

    constructor(props: IStatusMessageProps) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps: IStatusMessageProps) {
        return true;
    }

    render() {
        if (this.props.message === ''){
            return null;
        }

        return (
            <div className='status'>
                {this.props.message}
            </div>);
    }
}

export default StatusMessage;
