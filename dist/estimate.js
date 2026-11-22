(() => {
 const form=document.getElementById("estimate-request");
 const recipient=document.getElementById("wade-email").href.slice(7);
 const fallback=document.getElementById("assessment-email-fallback");
 const status=document.getElementById("estimate-status");
 const copyField=document.getElementById("copy-fallback");
 const button=document.getElementById("assessment-submit");
 const target=window.warhorse?.assessmentEndpoint || "";
 const direct=/^https:\/\/formspree\.io\/f\/[a-z0-9]+\/?$/i.test(target);
 if(direct){button.textContent="Send assessment request";document.getElementById("assessment-help").textContent="Send Wade the building details and a phone number or email where he can reach you.";}
 function details(){
   for(const el of form.querySelectorAll("[required]"))el.setCustomValidity(el.value.trim()?"":"Please complete this field.");
   if(!form.reportValidity())return null;
   const d=Object.fromEntries([...new FormData(form)].map(([k,v])=>[k,String(v).trim()]));
   const text=["Hi Wade,","I’d like a roof assessment for "+d.location+".",d.message,"",d.name,d.contact].join("\n");
   const subject="Roof assessment — "+d.location;
   return {d,text,subject,href:"mailto:"+recipient+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(text)};
 }
 form.addEventListener("input",e=>{e.target.setCustomValidity?.("");status.textContent="";fallback.hidden=true;copyField.hidden=true;});
 form.addEventListener("submit",async e=>{
   e.preventDefault();if(button.disabled)return;
   const r=details();if(!r)return;
   fallback.href=r.href;
   if(!direct){fallback.hidden=false;status.textContent="Send the draft from your email app. You can also copy the request.";window.location.href=r.href;return;}
   button.disabled=true;
   try {
     const res=await fetch(target,{method:"POST",headers:{"Accept":"application/json","Content-Type":"application/json"},body:JSON.stringify({...r.d,_subject:r.subject}),signal:AbortSignal.timeout(15000)});
     if(!res.ok)throw Error("Request was not accepted");
     form.reset();fallback.hidden=true;status.textContent="Your request was submitted. Wade has the contact details you supplied.";
   }catch{fallback.hidden=false;status.textContent="We could not confirm delivery. Call Wade or send the details by email.";}
   finally{button.disabled=false;}
 });
 document.getElementById("copy-request").addEventListener("click",async()=>{
   const r=details();if(!r)return;
   const body="To: "+recipient+"\nSubject: "+r.subject+"\n\n"+r.text;
   try{await navigator.clipboard.writeText(body);status.textContent="Request copied. Paste it into an email to Wade.";}
   catch{copyField.hidden=false;copyField.value=body;copyField.focus();copyField.select();status.textContent="Select and copy your request below.";}
 });
 form.hidden=false;
})();