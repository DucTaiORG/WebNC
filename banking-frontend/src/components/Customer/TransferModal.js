import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

export default class TransferModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            otpCode: 123456,
        }
    }

    handleOTPChange = e =>{
        this.setState({otpCode: e.target.value});
    }

    handleSubmitModal = () => {
        this.props.submitmodal(this.state.otpCode);
        this.handelCloseModal();
    }

    handelCloseModal = () => {
        this.props.closemodal();
    }

    render(){
        return (
            <Modal {...this.props} size="sm" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <input type="number" name="optCode" value={this.state.otpCode} placeholder="Enter OTP" onChange={this.handleOTPChange} className="customer-modal-input"/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handelCloseModal}>Close</Button>
                    <Button variant="primary" onClick={this.handleSubmitModal}>Confirm</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}