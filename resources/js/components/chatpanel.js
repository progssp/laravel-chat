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
        this.renderList = this.renderList.bind(this);
        this.subscribeToPusher = this.subscribeToPusher.bind(this);
        this.loadUsers = this.loadUsers.bind(this);
        this.loadChats = this.loadChats.bind(this);
        
    }

    componentDidMount(){
        this.loadUsers();
        //this.subscribeToPusher();    
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
    

    renderList(dataToRender){
        let list = document.getElementById('chat_list');
        let list_item = document.createElement('li');
        list_item.innerHTML = dataToRender;
        list.appendChild(list_item);
    }

    handleEve(e){
        let msg = document.getElementById('chat_tbox').value;
        
        let tok = document.querySelector('meta[name="csrf-token"]').content;
        
        
        let data = new FormData();
        data.append('message','msg');
        fetch('http://127.0.0.1:8000/messages?message='+msg+'&rec_id=2',{
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
        let a_tok = document.querySelector('meta[name="csrf-token"]').content;
        //suscribing to pusher channel
        Pusher.logToConsole = true;
        var pusher = new Pusher('649f5ddeef4b7a77a1f3', {
            cluster: 'ap2',
            authEndpoint:'/broadcasting/auth',
            auth:{
                headers:{
                    'X-CSRF-TOKEN':a_tok
                }
            }
        });
        var new_msg = [];
        var channel = pusher.subscribe('private-chat-'+user.id);
        channel.bind('App\\Events\\MessageEvent', function(d) {
            console.log("you have a new message:"+JSON.stringify(d));
            alert(d.msg);
            //new_msg.push(d.message.message);
            //console.log(JSON.stringify(new_msg));            
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
                                    <a href="#"><li id={number.id} onClick={this.loadChats} className="list-group-item list-group-item-action" key={number.id}>{number.name}</li></a>  )}
                                </ul>
                            </div>                            
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <div className="card-header">{isAnyUserActive?this.state.active_user[0].name:'no active'}</div>
                            <div className="card-body">
                                <ul id="chat_list" className="chat_list list-group">
                                    {this.state.msg_list.map((msgs) =>
                                    <li className="list-group-item" id={msgs.id} key={msgs.id}>{msgs.message}</li>  )}
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