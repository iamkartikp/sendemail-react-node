import React, { Component } from 'react';

import axios from 'axios';

class TimeStamp extends Component {
    state = {
        posts: []
    }

    componentDidMount() {
        axios.get('https://script.googleusercontent.com/macros/echo?user_content_key=IpjnrKIBRIcpADC_toSkj9YW8ZEUesup1yKq2mfC0VH34GBR3_LXXD8N7cLZxWBBZJvVZuafra3QoMwSTcdUCPzso3RNE2Spm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnC09Nb0QZ6ca_LU0vmo6mSiQ7SyFG3CgdL9-1Vgcha-TAYaAGhh-9xNG-9rMNEZHQRElvdDletx0&lib=MlJcTt87ug5f_XmzO-tnIbN3yFe7Nfhi6')
        .then(data => {
            this.setState({
                posts: data.data[0].slots
            })

            // data.data.forEach(d => {
            //     console.log(d.course_id,d.course_name);
            //     d.slots.forEach(x => {
            //         // new Date(x.slot + 14400) <= new Date(Date.now()) && new Date(Date.now) >= new Date(x.slot + 604800)
            //         if(x.slot+14400 >= Date.now() && Date.now() <= x.slot+604800)
            //             console.log(new Date(parseInt(x.slot)));
            //     })
            // })

            this.state.posts.forEach(x => {
                console.log(new Date(parseInt(x.slot)));
            })
        })
        .catch(err => {
            console.log(err);
        })
    }
    
    render() {
        return (
            <div className="timestamp">
                <select className="form-group col-12 btn btn-primary container" >
                    {this.state.posts.map(x => (
                       <option className="form-group">{x.slot}</option> 
                    ))}
                </select>
            </div>
        )
    }
}

export default TimeStamp;