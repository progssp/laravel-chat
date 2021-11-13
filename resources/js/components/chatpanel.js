import React from 'react';
import './styles.css';

class Chatpanel extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            msg_list:[],
            user_list:[],
            active_user:[]
        }        
        //alert(user.id);
        this.handleEve = this.handleEve.bind(this);
        this.subscribeToPusher = this.subscribeToPusher.bind(this);
        this.loadUsers = this.loadUsers.bind(this);
        this.loadChats = this.loadChats.bind(this);
        this.getActiveUser = this.getActiveUser.bind(this);
        
    }

    componentDidMount(){
        this.loadUsers();
        this.subscribeToPusher();    
    }

    getActiveUser(){
        if(this.state.active_user.length == 0){
            return;
        }
        else{
            return this.state.active_user[0];
        }
    }

    loadUsers(){
        let tok = document.querySelector('meta[name="csrf-token"]').content;
        fetch('http://127.0.0.1:8000/fetchUsers',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                X_CSRF_TOKEN:tok,
                'Accept':'application/json'
            }
        })
        .then(response => response.json())
        .then(dat => {
            let arr = [];
            for(var x=0;x<dat.length;x++){
                arr.push(dat[x]);
            }
            this.setState({user_list:this.state.user_list.concat(arr)});
        })
        .catch((error) => {
            console.error(error);
        }); 
    }

    loadChats(el_id){
        let clicked_user_id = el_id.target.id;
        clicked_user_id = clicked_user_id.substr(5,clicked_user_id.length);
        
        
        for(var eu=0;eu<this.state.user_list.length;eu++){
            if(this.state.user_list[eu].id == clicked_user_id){
                this.setState({active_user:this.state.active_user.splice(0,this.state.active_user.length)});
                this.setState({active_user:this.state.active_user.concat(this.state.user_list[eu])});
                break;
            }
        }
        let tok = document.querySelector('meta[name="csrf-token"]').content;
        // alert(el_id.target.id);
        fetch('http://127.0.0.1:8000/fetchmessages?rec_id='+clicked_user_id,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                X_CSRF_TOKEN:tok,
                'Accept':'application/json'
            }
        })
        .then(response => response.json())
        .then(dat => {
            this.setState({
                //activeUser:this.state.activeUser.push(this.state.user_list[clicked_user_id
            });
            console.log(JSON.stringify(dat));
            let arr = [];
            for(var x=0;x<dat.length;x++){
                //console.log(JSON.stringify(dat[x].message));
                arr.push(dat[x]);      
            }
            this.setState({msg_list:[]});
            this.setState({
                msg_list:this.state.msg_list.concat(arr)
            });
        })
        .catch((error) => {
            console.error(error);
        }); 
    }
    

    handleEve(e){
        let msg = document.getElementById('chat_tbox').value;
        
        let tok = document.querySelector('meta[name="csrf-token"]').content;
        
        let activeUserId = this.state.active_user[0].id;
    

        fetch('http://127.0.0.1:8000/messages?message='+msg+'&rec_id='+activeUserId,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'X-CSRF-TOKEN':tok,
                'Accept':'application/json'
            },
            //body:JSON.stringify(data)
        })
        .then(response => response.json())
        .then(dat => {
            console.log('from handleve : '+JSON.stringify(dat));
        })
        .catch((error) => {
            console.error(error);
        });

        //this.subscribeToPusher();       

        
    }

    subscribeToPusher(){
        // let a_tok = document.querySelector('meta[name="csrf-token"]').content;
        
        // //suscribing to pusher channel
        // Pusher.logToConsole = true;
        // var pusher = new Pusher('649f5ddeef4b7a77a1f3', {
        //     cluster: 'ap2',
        //     authEndpoint:'/broadcasting/auth',
        //     auth:{
        //         headers:{
        //             'X-CSRF-TOKEN':a_tok
        //         }
        //     }
        // });
        var new_msg = [];
        var channel = pusher.subscribe('private-chat-'+user.id);
        channel.bind('App\\Events\\MessageEvent',(d) => {
            
            //checking sent message from sender side
            if(d.sender_id == user.id){
                if(this.state.active_user[0].id == d.rec_id){
                    //alert('you have sent message to this user.');
                    this.setState({msg_list:this.state.msg_list.concat(d)});
                }
            }
            
            //checking message has been received or not
            if(d.sender_id != user.id){
                if(this.state.active_user.length != 0){
                    if(this.state.active_user[0].id == d.sender_id){
                        //alert('you have sent message to this user.');
                        this.setState({msg_list:this.state.msg_list.concat(d)});
                    }
                    else{
                        var id_to_notify = document.getElementById('user_'+d.sender_id);
                    }
                }
                else{
                    alert('no active user, you got a new message : '+d.message);
                }
            }

        });        
    }

    

    render(){
        let isAnyUserActive=false;
        if(this.state.active_user.length != 0){
            isAnyUserActive=true;
        }
        return (
            <div className="container">     
                          
                <div className="row no-gutters">
                    <div className="col-3">
                        <div className="card">
                            <div className="card-header">card header</div>
                            <div className="card-body">
                                <ul id="user_list" className="user_list list-group">
                                    {this.state.user_list.map((number) =>
                                    <a href="#">
                                        <li id={"user_"+number.id} onClick={this.loadChats} className="list-group-item d-flex justify-content-between align-items-center" key={'user_'+number.id}>
                                            {number.name}
                                            <span className="badge badge-primary badge-pill">14</span>
                                        </li>
                                    </a>  )}
                                </ul>
                            </div>                            
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <div className="card-header">{isAnyUserActive?this.state.active_user[0].name:'no active'}</div>
                            <div className="card-body">
                                <ul id="chat_list" className="chat_list">
                                    {this.state.msg_list.map((msgs) => 
                                        (msgs.sender_id==user.id)?    
                                        <div className="sent" id={msgs.id} key={msgs.id}>{msgs.message}</div>                                
                                        :
                                        <div className="replies" id={msgs.id} key={msgs.id}>{msgs.message}</div>
                                    
                                    )}
                                </ul>
                            </div>
                            <div className="card-footer">
                                <input type="text" id="chat_tbox" className="form-control" placeholder="Enter message..." />
                                <input type="submit" className="btn btn-primary btn-sm" value="GO" onClick={this.handleEve} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Chatpanel;