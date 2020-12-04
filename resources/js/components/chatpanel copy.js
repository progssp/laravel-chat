import React from 'react';
// import { render } from 'react-dom';
// import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import { Launcher } from 'rc-chat-view';
import './styles.css';
import { Picker } from 'emoji-mart';


// import moment from 'moment';

class NewComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            chosenEmoji: {},
            childVisible: false,
            emoji: "",
            text: ""
        }        
        // this.onEmojiClick = this.onEmojiClick.bind(this);
        // this.onEmojiClick = this.onEmojiClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addEmoji = this.addEmoji.bind(this);
        // console.log('users',this.state.user_list)
        
    }


    handleChange = (e) => {
        this.setState({ text: e.emoticons.native });
        console.log(e)
    }

    onEmojiClick(event, emojiObject) {
        console.log('the event is ',event)
        console.log("eo", emojiObject);
        this.setState({ chosenEmoji: emojiObject }, () => {
          console.log(this.state.chosenEmoji, "chosenEmoji()");
        });
    }

    addEmoji = (e) => {
        console.log('eeeeeh', e.native)
        console.log('current ',this.state.text)
        // let emoji = e.native;
        // this.setState({ text:  this.state.text + e.native }, () => {
        //     console.log(this.state.text, "chosenEmoji()");
        // });
        this.state.text = this.props.elementValue;
        // this.props.elementValue = this.state.text;
        console.log(this.state.text, 'after parent')
        this.setState({ text:  this.props.elementValue + e.native }, () => {
            console.log(this.state.text, "chosenEmoji()");
        });
        // this.setState({
        //     text:  this.state.text + e.native
        // });
    };

    render() {
      const {text, onChangeText} = this.props;
      return (
        <div {...this.props}>
          {/* <Picker
            onEmojiClick={this.onEmojiClick}
            disableAutoFocus={true}
            skinTone={SKIN_TONE_MEDIUM_DARK}
            groupNames={{ smileys_people: "PEOPLE" }}
        /> */}
        <Picker onSelect={this.addEmoji} value={text} onClick={onChangeText} />
        {this.state.text}
        {/* <br />
        <strong>Unified:</strong> {this.state.chosenEmoji.unified}
        <br />
        <strong>Names:</strong> {this.state.chosenEmoji.names}
        <br />
        <strong>Symbol:</strong> {this.state.chosenEmoji.emoji}
        <br />
        <strong>ActiveSkinTone:</strong> {this.state.chosenEmoji.activeSkinTone} 
        */}
        </div>
      );
    }  
}
  
  class Button extends React.Component {
    render() {
      return (
        <button {...this.props}>
          click
        </button>
      );
    }  
  }

class Chatpanel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            msg_list:[],
            user_list:[],
            active_user:[],
            current_usr:0,
            messageList: [],
            chosenEmoji: {},
            clicked: false,
            childVisible: false,
            emoji: "",
            text: ""
        }        
        // alert(user.id);
        this.handleEve = this.handleEve.bind(this);
        // this.renderList = this.renderList.bind(this);
        this.subscribeToPusher = this.subscribeToPusher.bind(this);
        this.loadUsers = this.loadUsers.bind(this);
        this.loadChats = this.loadChats.bind(this);
        this.onEmojiClick = this.onEmojiClick.bind(this);
        // this.picker = this.picker.bind(this);
        this.handleClick = this.handleClick.bind(this);
        // console.log('users',this.state.user_list)
        
    }

    // const [chosenEmoji, setChosenEmoji] = useState(null);


    handleClick(e) {
        // this.setState({
        //   clicked: true
        // });
        this.setState({childVisible: !this.state.childVisible});
  
    }

    onEmojiClick(event, emojiObject) {
        console.log('the event is ',event)
        console.log("eo", emojiObject);
        this.setState({ chosenEmoji: emojiObject }, () => {
          console.log(this.state.chosenEmoji, "chosenEmoji()");
        });
    }

    componentDidMount(){
        this.loadUsers();
        //this.subscribeToPusher();    
    }

    loadUsers(){
        let tok = document.querySelector('meta[name="csrf-token"]').content;
        fetch('fetchusers',{
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

            console.log('this beauty ', arr.find(obj => { return obj.id}));
        })
        .catch((error) => {
            console.error(error);
        }); 
    }

    loadChats(el_id){
        let clicked_user_id = Number(el_id.target.id);
        console.log('asdfg',clicked_user_id);
        // this.setState({current_usr:clicked_user_id})
        // this.setState({current_usr:this.state.current_usr+clicked_user_id})
        this.setState({ current_usr: clicked_user_id }, () => {
            console.log(this.state.current_usr, 'current user');
        }); 
        // console.log('types ',typeof(this.state.current_usr),typeof(clicked_user_id))
        // this.state.current_usr = this.state.current_usr+clicked_user_id
        // console.log('asdfgb',this.state.current_usr);

        for(var eu=0;eu<this.state.user_list.length;eu++){
            if(this.state.user_list[eu].id == clicked_user_id){
                this.setState({active_user:this.state.active_user.splice(0,this.state.active_user.length)});
                this.setState({active_user:this.state.active_user.concat(this.state.user_list[eu])});
                break;
            }
        }
        // console.log('active user', this.state.active_user)
        let tok = document.querySelector('meta[name="csrf-token"]').content;
        // alert(el_id.target.id);
        fetch('fetchmessages?rec_id='+clicked_user_id,{
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
            console.log('messsages', this.state.msg_list)
        })
        .catch((error) => {
            console.error(error);
        }); 
    }
    
    handleEve(e){
        console.log('wiwi', e.target.value)
        console.log('wiwii',this.state.text)
        // console.log('this beautyin hand ', this.loadUsers(arr.find(obj => { return obj.id})));
        // let msg = document.getElementById('chat_tbox').value + this.state.text;
        let msg = this.state.text;
        console.log('message ', msg)
        let tok = document.querySelector('meta[name="csrf-token"]').content;
        // console.log('asdfg',this.state.current_usr);
        let user_id = this.state.current_usr;
        console.log('comeon', user_id)
        // console.log(this.current_usr, el_id, e);
        let data = new FormData();
        data.append('message','msg');
        fetch('messages?message='+msg+'&rec_id='+user_id,{
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

    // picker() {
    //     // console.log('this is piacker',this.state.chosenEmoji.emoji)
    //     <div>
    //         <Picker
    //         onEmojiClick={this.onEmojiClick}
    //         disableAutoFocus={true}
    //         skinTone={SKIN_TONE_MEDIUM_DARK}
    //         groupNames={{ smileys_people: "PEOPLE" }}
    //     />
    //     <br />
    //     <strong>Unified:</strong> {this.state.chosenEmoji.unified}
    //     <br />
    //     <strong>Names:</strong> {this.state.chosenEmoji.names}
    //     <br />
    //     <strong>Symbol:</strong> {this.state.chosenEmoji.emoji}
    //     <br />
    //     <strong>ActiveSkinTone:</strong> {this.state.chosenEmoji.activeSkinTone}
                             
    //     </div>
    // }

    handleChange = (e) => {
        this.setState({ text: e.target.value });
        console.log(e)
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
                            
                                {/* <button type="button" onClick={this.picker}>Emoji</button> */}
                                <Button onClick={this.handleClick} />
                                {this.state.childVisible ? <NewComponent  className="card-footer-emoji" elementValue={this.state.text} /> : null}
                                {/* {this.state.childVisible} */}
                                {/* {this.state.chosenEmoji.emoji} */}
                                {this.state.text}
                                <input type="text" 
                                    //    id="chat_tbox" 
                                       className="form-control" 
                                       placeholder="Enter message..." 
                                       value={this.state.text}
                                       onChange={this.handleChange}
                                       required />
                                {/* <NewComponent elementValue={this.state.text} /> */}
                                {/* <input onClick={this.picker} value=":" /> */}
                                {/* <input type="submit" className="btn btn-primary btn-sm" value=":)" onEmojiClick={onEmojiClick} onClick={this.handleEve} /> */}
                                <input type="submit" className="btn btn-primary btn-sm" value="Send" onClick={this.handleEve} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Chatpanel;