@extends('layouts.app')

@section('content')
    <script>
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
    </script>
    <div class="container">
        <div class="row">
            <div class="col-md">
                <div id="chat_panel_container"></div>
            </div>
        </div>
        <div class="row">
            <div class="col-md">
            <div id="chat_submit_container"></div>
            </div>
        </div>
    </div>

    
@endsection
