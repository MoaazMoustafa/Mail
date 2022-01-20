document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
  document.getElementById("compose-form").addEventListener('submit',(event)=>sendEmail(event));
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  getSentEmails(mailbox)
}



function sendEmail(e){
  e.preventDefault()
  let data = {
    recipients:e.target.recevier.value,
    subject:e.target.subject.value,
    body:e.target.body.value
  }
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      console.log('done')
  });
  load_mailbox('sent')
}

function getSentEmails(mailbox){
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);
      
      
      let htmlArr = emails.map((item)=>{
        let classes= 'moaazbox'
        if(!item.read){classes ='moaazbox notread'}
        return `<div class='${classes}'>
        <h1>To: ${item.recipients}</h1>
        <h2>Subject: ${item.subject}</h2>
        <button class="btn btn-sm btn-outline-primary" onclick='viewEmail(${item.id})'>View</button>
        </div>`
       
        
      })
      document.getElementById('main').innerHTML=htmlArr.join()


  });
}

function viewEmail(id){
  fetch(`/emails/${id}`)
.then(response => response.json())
.then(email => {
    // Print email
    console.log(email);
    let archive = 'Archive'
    if(email.archived){archive = 'UnArchived'}
    let htmlsting = `<div >
    <h1>To: ${email.recipients}</h1>
    <h2>Subject: ${email.subject}</h2>
    <h3>Subject: ${email.body}</h3>
    <h4>Subject: ${email.timestamp}</h4>
    <button class="btn btn-sm btn-outline-primary" onclick='archiveEmail(event,${email.id})'>${archive}</button>
    </div>`
    document.getElementById('main').innerHTML = htmlsting
    if(!email.read){
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
      })
      console.log('the email was not read')
    }
    

});
}

function archiveEmail(e,id){
  // console.log(e.target.innerHTML,'🌹🌹🌹')
  let archiveStatus;
  if(e.target.innerHTML == 'Archive'){
    archiveStatus = true
  } 
  else{
    archiveStatus = false
  }
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: archiveStatus
    })
  })
  load_mailbox('inbox')
  // console.log(archiveStatus)
}