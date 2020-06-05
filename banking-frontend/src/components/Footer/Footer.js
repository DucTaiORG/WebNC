import React, { Component } from "react";
import "./Footer.css";

export default class Footer extends Component{
    render(){
        return(
            <div className="main-footer">
                <div className="row">
                    <div className="col">
                        <h4>Address</h4>
                        <p>
                            227, Nguyễn Văn Cừ, Quận 5, TPHCM
                        </p>
                    </div>
                    <div className="col">
                        <h4>Author</h4>
                        <p>
                            Đức Tài, Hoàng Phát
                        </p>
                    </div>
                    <div className="col">
                        <h4>Email</h4>
                        <ul>
                            <li>lductai98@gmail.com</li>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <h6 className="col-sm">
                        &copy;{new Date().getFullYear()} DT BANK INC | All right reserved | Terms Of Service | Privacy
                    </h6>
                </div>
            </div>
        );
    }
}