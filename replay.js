/* RP v34 — attack replay from the in-game radar.
   Frames are read from the player's own file on this device only, reduced to dot coordinates and discarded.
   Nothing visual is kept or sent: the output is numbers only. */
(function(W){"use strict";
var MAXW=960;
function seek(v,t){return new Promise(function(res){var done=false;function ok(){if(done)return;done=true;v.removeEventListener("seeked",ok);res()}v.addEventListener("seeked",ok);v.currentTime=Math.max(0,t);setTimeout(ok,2500)})}
function lum(d,n){var o=new Float32Array(n);for(var i=0,j=0;i<n;i++,j+=4)o[i]=(d[j]+d[j+1]+d[j+2])/3;return o}
function median(arrs,n){var k=arrs.length,o=new Float32Array(n),tmp=new Float32Array(k);for(var i=0;i<n;i++){for(var a=0;a<k;a++)tmp[a]=arrs[a][i];tmp.sort();o[i]=tmp[k>>1]}return o}
function grad(V,w,h){var G=new Float32Array(w*h);for(var y=1;y<h-1;y++)for(var x=1;x<w-1;x++){var i=y*w+x,gx=(V[i+1]-V[i-1])/2,gy=(V[i+w]-V[i-w])/2;G[i]=Math.sqrt(gx*gx+gy*gy)}return G}
function pct(arr,p){var a=Array.prototype.slice.call(arr).sort(function(x,y){return x-y});return a[Math.min(a.length-1,Math.floor(a.length*p))]}
function polyfit(xs,ys){var n=xs.length,sx=0,sy=0,sxx=0,sxy=0;for(var i=0;i<n;i++){sx+=xs[i];sy+=ys[i];sxx+=xs[i]*xs[i];sxy+=xs[i]*ys[i]}var d=n*sxx-sx*sx;if(!d)return[0,sy/n];var a=(n*sxy-sx*sy)/d;return[a,(sy-a*sx)/n]}
function pv(p,x){return p[0]*x+p[1]}
/* the radar's own pitch outline: the edges that stay put across frames (the main picture moves, the overlay does not) */
function findOutline(M,w,h,frac){
  var G=grad(M,w,h),y0=Math.floor(h*0.0),sub=[];for(var i=0;i<G.length;i++)sub.push(G[i]);
  var thr=Math.max(pct(sub,0.99)*(frac||0.5),3),B=new Uint8Array(w*h);
  for(var y=1;y<h-1;y++)for(var x=1;x<w-1;x++){var i2=y*w+x;if(G[i2]>thr){B[i2]=1}}
  // dilate 1
  var D=new Uint8Array(w*h);for(y=1;y<h-1;y++)for(x=1;x<w-1;x++){var q=y*w+x;if(B[q]||B[q-1]||B[q+1]||B[q-w]||B[q+w]||B[q-w-1]||B[q-w+1]||B[q+w-1]||B[q+w+1])D[q]=1}
  // components
  var lab=new Int32Array(w*h),best=null,st=[],id=0;
  for(var s=0;s<w*h;s++){if(!D[s]||lab[s])continue;id++;var minx=1e9,maxx=-1,miny=1e9,maxy=-1,px=[];st.push(s);lab[s]=id;
    while(st.length){var c=st.pop(),cx=c%w,cy=(c/w)|0;px.push(c);if(cx<minx)minx=cx;if(cx>maxx)maxx=cx;if(cy<miny)miny=cy;if(cy>maxy)maxy=cy;
      var nb=[c-1,c+1,c-w,c+w];for(var k=0;k<4;k++){var nn=nb[k];if(nn>=0&&nn<w*h&&D[nn]&&!lab[nn]){lab[nn]=id;st.push(nn)}}}
    var ww=maxx-minx+1,hh=maxy-miny+1;if(ww<w*0.1||hh<h*0.08)continue;var ar=ww/hh;if(ar<1.15||ar>2.8)continue;
    if(!best||ww*hh>best.a)best={a:ww*hh,id:id,px:px,minx:minx,maxx:maxx,miny:miny,maxy:maxy}}
  if(!best)return null;
  var rows={};best.px.forEach(function(c){var x=c%w,y=(c/w)|0,r=rows[y];if(!r)rows[y]=[x,x];else{if(x<r[0])r[0]=x;if(x>r[1])r[1]=x}});
  var ys=[],L=[],R=[];Object.keys(rows).forEach(function(k){var r=rows[k];if(r[1]-r[0]>1){ys.push(+k);L.push(r[0]);R.push(r[1])}});
  var wid=R.map(function(r,i){return r-L[i]}),w90=pct(wid,0.9),Y=[],LL=[],RR=[];
  for(var i3=0;i3<ys.length;i3++)if(wid[i3]>0.85*w90){Y.push(ys[i3]);LL.push(L[i3]);RR.push(R[i3])}
  var pl,pr;for(var it=0;it<2;it++){pl=polyfit(Y,LL);pr=polyfit(Y,RR);var res=Y.map(function(y,i){return Math.abs(pv(pl,y)-LL[i])+Math.abs(pv(pr,y)-RR[i])}),cut=Math.max(2,pct(res,0.7)),Y2=[],L2=[],R2=[];
    for(var j=0;j<Y.length;j++)if(res[j]<=cut){Y2.push(Y[j]);L2.push(LL[j]);R2.push(RR[j])}if(Y2.length<6)break;Y=Y2;LL=L2;RR=R2}
  pl=polyfit(Y,LL);pr=polyfit(Y,RR);
  var o={top:best.miny+1,bot:best.maxy-1,pl:pl,pr:pr,G:G,thr:thr};
  // outline pixels used later to tell whether the radar is on screen in a frame
  var op=[];for(var yy=o.top;yy<=o.bot;yy+=1){var l=Math.round(pv(pl,yy)),r2=Math.round(pv(pr,yy));[l,r2].forEach(function(x){if(x>0&&x<w-1&&G[yy*w+x]>thr*0.8)op.push(yy*w+x)})}
  for(var xx=Math.round(pv(pl,o.top));xx<=Math.round(pv(pr,o.top));xx++){[o.top,o.bot].forEach(function(y){if(G[y*w+xx]>thr*0.8)op.push(y*w+xx)})}
  o.op=op;var sm=0;op.forEach(function(i){sm+=G[i]});o.opG=op.length?sm/op.length:0;
  var rw=pv(pr,(o.top+o.bot)/2)-pv(pl,(o.top+o.bot)/2);o.w=rw;o.h=o.bot-o.top;
  if(rw<40||o.h<20||o.op.length<40)return null;
  return o}
function blur(V,w,h,s){var r=Math.max(1,Math.ceil(s*2.5)),k=[],sum=0;for(var i=-r;i<=r;i++){var v=Math.exp(-i*i/(2*s*s));k.push(v);sum+=v}k=k.map(function(v){return v/sum});
  var T=new Float32Array(w*h),O=new Float32Array(w*h);
  for(var y=0;y<h;y++)for(var x=0;x<w;x++){var a=0;for(var j=-r;j<=r;j++){var xx=Math.min(w-1,Math.max(0,x+j));a+=V[y*w+xx]*k[j+r]}T[y*w+x]=a}
  for(y=0;y<h;y++)for(x=0;x<w;x++){var b=0;for(j=-r;j<=r;j++){var yy=Math.min(h-1,Math.max(0,y+j));b+=T[yy*w+x]*k[j+r]}O[y*w+x]=b}return O}
/* dots in one frame: bright spots on the radar (difference of blurs), merged, with colour and centre darkness for the team split */
function detect(rgba,w,h,o,ox,oy,Mb){
  var n=w*h,V=lum(rgba,n),sc=Math.max(1,o.w/100),Vd=new Float32Array(n);for(var z=0;z<n;z++)Vd[z]=Mb?Math.abs(V[z]-Mb[z]):V[z];var s1=blur(Vd,w,h,0.8*sc),s2=blur(Vd,w,h,2.5*sc),inset=0.035,bgv=[];
  var mask=new Uint8Array(n),top=o.top-oy,bot=o.bot-oy,hh=bot-top;
  for(var y=Math.ceil(top+hh*inset*1.6);y<=bot-hh*inset*1.6;y++){if(y<0||y>=h)continue;var l=pv(o.pl,y+oy)-ox,r=pv(o.pr,y+oy)-ox,ww=r-l;
    for(var x=Math.ceil(l+ww*inset);x<r-ww*inset;x++){if(x>=0&&x<w){mask[y*w+x]=1;bgv.push(V[y*w+x])}}}
  if(bgv.length<50)return [];
  var bg=pct(bgv,0.5),D=new Float32Array(n),pk=[];for(var i=0;i<n;i++)D[i]=mask[i]?s1[i]-s2[i]:0;
  for(y=1;y<h-1;y++)for(x=1;x<w-1;x++){var q=y*w+x,v=D[q];if(v<8)continue;
    if(v>=D[q-1]&&v>=D[q+1]&&v>=D[q-w]&&v>=D[q+w]&&v>=D[q-w-1]&&v>=D[q-w+1]&&v>=D[q+w-1]&&v>=D[q+w+1])pk.push([v,y,x])}
  pk.sort(function(a,b){return b[0]-a[0]});
  var G=[],rad=3.4*sc;
  pk.forEach(function(p){for(var g=0;g<G.length;g++){var e=G[g];if((e.y0-p[1])*(e.y0-p[1])+(e.x0-p[2])*(e.x0-p[2])<=rad*rad){e.p.push(p);return}}G.push({y0:p[1],x0:p[2],p:[p]})});
  if(!G.length)return [];
  var top10=G.slice(0,10).map(function(g){return g.p[0][0]}),kmin=Math.max(8,0.2*top10[Math.floor(top10.length/2)]);
  var out=[],ln=Math.max(2,Math.round(2.6*sc));G.forEach(function(g){var s=g.p[0][0];if(s<kmin)return;var py=g.p[0][1],px2=g.p[0][2],pv0=s1[py*w+px2];
    if(px2-ln>=0&&px2+ln<w&&py-ln>=0&&py+ln<h){var hl=Math.min(s1[py*w+px2-ln],s1[py*w+px2+ln]),vl=Math.min(s1[(py-ln)*w+px2],s1[(py+ln)*w+px2]);if(hl>pv0*0.6||vl>pv0*0.6)return}var sw=0,sy=0,sx=0;g.p.forEach(function(p){sw+=p[0];sy+=p[0]*p[1];sx+=p[0]*p[2]});var cy=sy/sw,cx=sx/sw,iy=Math.round(cy),ix=Math.round(cx),mn=1e9,cr=0,cg=0,cb=0,cn=0,rr=Math.max(1,Math.round(sc*0.9));
    for(var dy=-rr;dy<=rr;dy++)for(var dx=-rr;dx<=rr;dx++){var yy=iy+dy,xx=ix+dx;if(yy<0||yy>=h||xx<0||xx>=w)continue;var j=yy*w+xx;if(V[j]<mn)mn=V[j];if(V[j]>bg*1.3){cr+=rgba[j*4];cg+=rgba[j*4+1];cb+=rgba[j*4+2];cn++}}
    var Y=cy+oy,X=cx+ox,L=pv(o.pl,Y),R=pv(o.pr,Y);cn=cn||1;var tot=(cr+cg+cb)/cn+1;
    out.push({u:(X-L)/(R-L),v:(Y-o.top)/(o.bot-o.top),s:s,dk:mn/(bg+1),c1:(cr-cg)/cn/tot,c2:(cb-cg)/cn/tot})});
  out.sort(function(a,b){return b.s-a.s});out=out.slice(0,24);
  // the ball / ball-carrier marker: FC draws it in yellow-orange on the radar
  var yb=0,yx=0,yy2=0;for(y=0;y<h;y++)for(x=0;x<w;x++){var k2=y*w+x;if(!mask[k2])continue;var R0=rgba[k2*4],G0=rgba[k2*4+1],B0=rgba[k2*4+2];if(R0>165&&G0>95&&B0<120&&R0-B0>75&&R0>=G0){yb++;yx+=x;yy2+=y}}
  if(yb>=2&&yb<60*sc*sc){var Yb=yy2/yb+oy,Xb=yx/yb+ox,Lb=pv(o.pl,Yb),Rb=pv(o.pr,Yb);out.ball=[(Xb-Lb)/(Rb-Lb),(Yb-o.top)/(o.bot-o.top)]}
  return out}
function present(V,w,o,ox,oy,wf,Mb,mask){var sm=0,c=0;o.op.forEach(function(i){var y=((i/wf)|0)-oy,x=(i%wf)-ox;var q=y*w+x;if(y>0&&x>0&&x<w-1){var gx=(V[q+1]-V[q-1])/2,gy=(V[q+w]-V[q-w])/2;sm+=Math.sqrt(gx*gx+gy*gy);c++}});
  var e=c?(sm/c)/(o.opG||1):0;if(!Mb)return e;var df=[];for(var k=0;k<V.length;k+=2)if(mask[k])df.push(Math.abs(V[k]-Mb[k]));if(!df.length)return 0;df.sort(function(a,b){return a-b});var d60=df[Math.floor(df.length*0.6)];
  return d60>14?0:e}
/* two teams: 2-means over centre darkness + colour (works for colour radars and for shape radars: filled vs ring) */
function kmeans2(P){var dims=P[0].length,best=null;
  for(var d=0;d<dims;d++){var x=P.map(function(p){return p[d]}),s=x.slice().sort(function(a,b){return a-b}),lo=s[Math.floor(s.length*0.02)],hi=s[Math.floor(s.length*0.98)];
    x=x.map(function(v){return Math.max(lo,Math.min(hi,v))});var c0=s[Math.floor(s.length*0.15)],c1=s[Math.floor(s.length*0.85)],lab=new Array(x.length);
    for(var it=0;it<20;it++){var a=0,an=0,b=0,bn=0;x.forEach(function(v,i){var l=Math.abs(v-c1)<Math.abs(v-c0)?1:0;lab[i]=l;if(l){b+=v;bn++}else{a+=v;an++}});if(an)c0=a/an;if(bn)c1=b/bn}
    var w0=0,w1=0,n0=0,n1=0;x.forEach(function(v,i){if(lab[i]){w1+=(v-c1)*(v-c1);n1++}else{w0+=(v-c0)*(v-c0);n0++}});var sd=Math.sqrt((w0+w1)/x.length)||1e-6,f=Math.abs(c1-c0)/sd,bal=Math.min(n0,n1)/x.length;
    if(bal<0.25)f*=0.2;if(!best||f>best.sep)best={lab:lab,sep:f,dim:d,bal:bal}}
  return best}
/* frame-to-frame tracks per team (nearest neighbour, gaps filled) */
function track(frames,team,N){var tr=[],maxd=0.09;
  frames.forEach(function(f,fi){var pts=f.filter(function(d){return d.t===team});var used={};
    var live=tr.filter(function(t){return fi-t.last<=5});var pairs=[];live.forEach(function(t){var lp=t.p[t.last];pts.forEach(function(p,pi){var dx=p.u-lp[0],dy=(p.v-lp[1])*0.62,d=Math.sqrt(dx*dx+dy*dy);if(d<maxd*(1+0.5*(fi-t.last-1)))pairs.push([d,t,pi])})});
    pairs.sort(function(a,b){return a[0]-b[0]});var tu=new Set();pairs.forEach(function(q){if(tu.has(q[1])||used[q[2]])return;tu.add(q[1]);used[q[2]]=1;q[1].p[fi]=[pts[q[2]].u,pts[q[2]].v];q[1].last=fi});
    pts.forEach(function(p,pi){if(!used[pi]){var t={p:{},last:fi};t.p[fi]=[p.u,p.v];tr.push(t)}})});
  tr.forEach(function(t){t.n=Object.keys(t.p).length});tr.sort(function(a,b){return b.n-a.n});
  return tr.filter(function(t){return t.n>=Math.max(3,N*0.25)}).slice(0,11).map(function(t){var ks=Object.keys(t.p).map(Number).sort(function(a,b){return a-b}),o=[];
    for(var i=0;i<N;i++){var a=null,b=null;for(var k=0;k<ks.length;k++){if(ks[k]<=i)a=ks[k];if(ks[k]>=i&&b==null)b=ks[k]}
      var pa=a!=null?t.p[a]:null,pb=b!=null?t.p[b]:null,p=pa&&pb?(a===b?pa:[pa[0]+(pb[0]-pa[0])*(i-a)/(b-a),pa[1]+(pb[1]-pa[1])*(i-a)/(b-a)]):(pa||pb);o.push(p)}
    return o})}
async function extract(file,moments,opt){
  opt=opt||{};var onp=opt.progress||function(){};
  var url=URL.createObjectURL(file),v=document.createElement("video");v.muted=true;v.playsInline=true;v.preload="auto";v.src=url;
  try{
    await new Promise(function(res,rej){if(v.readyState>=2)return res();v.onloadeddata=res;v.onerror=function(){rej(new Error("decode"))};setTimeout(function(){v.readyState>=1?res():rej(new Error("timeout"))},20000);
      // iOS loads a video only once it is asked to play; it is muted, never attached to the page, and paused at once
      try{var pp=v.play();if(pp&&pp.then)pp.then(function(){v.pause()}).catch(function(){})}catch(e){}});
    try{v.pause()}catch(e){}
    var dur=v.duration,vw=v.videoWidth,vh=v.videoHeight;if(!vw||!isFinite(dur))throw new Error("meta");
    var sc=Math.min(1,MAXW/vw),fw=Math.round(vw*sc),fh=Math.round(vh*sc),c=document.createElement("canvas");c.width=fw;c.height=fh;var g=c.getContext("2d",{willReadFrequently:true});
    // search zone: the lower half, middle 70% (where FC draws its radar)
    var zx=Math.floor(fw*0.15),zy=Math.floor(fh*0.5),zw=Math.floor(fw*0.7),zh=fh-zy;
    var FPS=opt.fps||3,wins=moments.map(function(m){var s=m.s;if(s==null||!isFinite(s)||s>dur)return null;var a=Math.max(0,s-8),b=Math.min(dur-0.05,s+6),ts=[];for(var t=a;t<=b;t+=1/FPS)ts.push(+t.toFixed(3));return ts});
    // pass 1: the stable overlay (median of a few frames from every window)
    var probe=[];wins.forEach(function(ts){if(ts)for(var i=0;i<ts.length;i+=Math.max(1,Math.floor(ts.length/7)))probe.push(ts[i])});
    if(probe.length<6){var st=dur/14;for(var q=1;q<14;q++)probe.push(q*st)}
    var L=[],tot=probe.length+wins.reduce(function(a,t){return a+(t?t.length:0)},0),done=0;
    for(var i=0;i<probe.length;i++){await seek(v,probe[i]);g.drawImage(v,0,0,fw,fh);L.push(lum(g.getImageData(zx,zy,zw,zh).data,zw*zh));onp(++done/tot)}
    var M=median(L,zw*zh);L=null;var Mz=M;
    var o=findOutline(M,zw,zh,0.5)||findOutline(M,zw,zh,0.3);
    if(!o)return {ok:false,why:"no_radar",replays:moments.map(function(){return null})};
    // outline back to frame coordinates
    o.top+=zy;o.bot+=zy;o.pl=[o.pl[0],o.pl[1]+zx-o.pl[0]*zy];o.pr=[o.pr[0],o.pr[1]+zx-o.pr[0]*zy];o.op=o.op.map(function(i){return (((i/zw)|0)+zy)*fw+(i%zw)+zx});
    var bx0=Math.max(0,Math.floor(Math.min(pv(o.pl,o.top),pv(o.pl,o.bot)))-3),bx1=Math.min(fw,Math.ceil(Math.max(pv(o.pr,o.top),pv(o.pr,o.bot)))+4),by0=Math.max(0,o.top-3),by1=Math.min(fh,o.bot+4),bw=bx1-bx0,bh=by1-by0;
    var Mk=new Uint8Array(bw*bh);for(var y3=0;y3<bh;y3++){var Y3=y3+by0;if(Y3<o.top+2||Y3>o.bot-2)continue;var l3=pv(o.pl,Y3)-bx0+2,r3=pv(o.pr,Y3)-bx0-2;for(var x3=Math.ceil(l3);x3<r3;x3++)Mk[y3*bw+x3]=1}
    var Mb=new Float32Array(bw*bh);for(var yy=0;yy<bh;yy++)for(var xx=0;xx<bw;xx++){var zx2=bx0+xx-zx,zy2=by0+yy-zy;Mb[yy*bw+xx]=(zx2>=0&&zx2<zw&&zy2>=0&&zy2<zh)?Mz[zy2*zw+zx2]:0}
    // pass 2: dots in every sampled frame of every window
    var all=[];
    for(var k=0;k<wins.length;k++){var ts=wins[k];if(!ts){all.push(null);continue}var fr=[];
      for(var j=0;j<ts.length;j++){await seek(v,ts[j]);g.drawImage(v,0,0,fw,fh);var d=g.getImageData(bx0,by0,bw,bh).data,V=lum(d,bw*bh),pr=present(V,bw,o,bx0,by0,fw,Mb,Mk);
        fr.push({t:ts[j],pr:pr,d:pr>0.55?detect(d,bw,bh,o,bx0,by0,Mb):[]});onp(++done/tot)}
      all.push(fr)}
    var R=finish(all,moments,o);if(W.R2W_DEBUG){R.raw=all;R.outline={top:o.top,bot:o.bot,pl:o.pl,pr:o.pr,fw:fw,fh:fh}}return R
  }finally{try{v.removeAttribute("src");v.load()}catch(e){}URL.revokeObjectURL(url)}}
function finish(all,moments,o){
  // team split over the whole match (the same two dot styles in every moment)
  var P=[],ref=[];all.forEach(function(fr,k){if(fr)fr.forEach(function(f,fi){f.d.forEach(function(d){P.push([d.dk,d.c1*3,d.c2*3]);ref.push(d)})})});
  if(P.length<60)return {ok:false,why:"few_dots",replays:moments.map(function(){return null})};
  var km=kmeans2(P);ref.forEach(function(d,i){d.t=km.lab[i]});
  var votes=[0,0],per=[];
  all.forEach(function(fr,k){if(!fr){per.push(null);return}
    // the longest run of frames with the radar on screen (a replay or close-up cuts it)
    var runs=[],cur=null;fr.forEach(function(f,i){var on=f.pr>0.55&&f.d.length>=12;if(on){if(!cur){cur={a:i,b:i}}else cur.b=i;}else if(cur&&i-cur.b>1){runs.push(cur);cur=null}});if(cur)runs.push(cur);
    var ms0=moments[k].s,ov=function(r){var a0=fr[r.a].t,b0=fr[r.b].t;return Math.max(0,Math.min(b0,ms0+1.5)-Math.max(a0,ms0-7))};runs.sort(function(a,b){return ov(b)-ov(a)||(b.b-b.a)-(a.b-a.a)});var r=runs[0];if(r&&ov(r)<1.5)r=null;if(!r||r.b-r.a+1<8){per.push(null);return}
    var a=Math.max(r.a,r.b-27),F=fr.slice(a,r.b+1).map(function(f){return f.d});
    // per-frame quality: about 20 dots, both teams present
    var good=0;F.forEach(function(f){var n0=f.filter(function(d){return d.t===0}).length,n1=f.length-n0;if(f.length>=15&&n0>=6&&n1>=6)good++});
    var conf=good/F.length;
    var T0=track(F,0,F.length),T1=track(F,1,F.length);
    if(T0.length<6||T1.length<6||conf<0.45){per.push(null);return}
    // who attacks: the end of the pitch where play finishes; the goalkeeper there belongs to the defending side
    var last=F.slice(-4),mu=0,c=0;last.forEach(function(f){f.forEach(function(d){mu+=d.u;c++})});mu/=c;var side=mu>0.5?1:0;
    var ex=[[],[]];F.slice(-8).forEach(function(f){var m2=[-1,-1];f.forEach(function(d){var e=side?d.u:1-d.u;if(e>m2[d.t])m2[d.t]=e});ex[0].push(m2[0]);ex[1].push(m2[1])});var md=function(a){a=a.slice().sort();return a[a.length>>1]};
    var att=md(ex[0])>md(ex[1])?1:0;var m=moments[k];if(m.kind==="good")votes[att]++;else votes[1-att]++;
    per.push({T:[T0,T1],att:att,flip:!side,conf:conf,t0:fr[a].t,n:F.length,F:F})});
  var user=votes[1]>votes[0]?1:0,res=[],okN=0;
  per.forEach(function(p,k){if(!p){res.push(null);return}okN++;res.push(pack(p,user,moments[k]))});
  return {ok:okN>0,replays:res,teamSep:km.sep,real:okN}}
function q(x){return Math.max(0,Math.min(1000,Math.round(x*1000)))}
/* ball: the attacker under most pressure, carried with continuity (the radar has no ball; this is an estimate and the data says so) */
function pack(p,user,m){p.attRadar=p.att;p.att=m.kind==="good"?user:1-user;var A=p.T[p.att],D=p.T[1-p.att],N=p.n,fx=function(pt){return p.flip?[1-pt[0],pt[1]]:pt};
  A=A.map(function(t){return t.map(fx)});D=D.map(function(t){return t.map(fx)});
  var ball=[],car=[],prev=-1,RB=p.F.map(function(f){return f.ball?fx(f.ball):null}),rbN=RB.filter(Boolean).length;
  if(rbN>=N*0.4){var ks=[];RB.forEach(function(b,i){if(b)ks.push(i)});
    for(var i=0;i<N;i++){var a=null,b2=null;ks.forEach(function(k){if(k<=i)a=k;if(k>=i&&b2==null)b2=k});var pa=a!=null?RB[a]:null,pb=b2!=null?RB[b2]:null,bp=pa&&pb&&a!==b2?[pa[0]+(pb[0]-pa[0])*(i-a)/(b2-a),pa[1]+(pb[1]-pa[1])*(i-a)/(b2-a)]:(pa||pb);ball.push(bp);
      var best=-1,bd=0.06;A.forEach(function(t,ti){var pt=t[i];if(!pt)return;var d=Math.hypot(pt[0]-bp[0],(pt[1]-bp[1])*0.65);if(d<bd){bd=d;best=ti}});car.push(best)}
    p.ballSrc="radar"}
  else for(var i=0;i<N;i++){var best=-1,bs=1e9;A.forEach(function(t,ti){var pt=t[i];if(!pt)return;var nd=1e9;D.forEach(function(d){var q2=d[i];if(!q2)return;var dx=q2[0]-pt[0],dy=(q2[1]-pt[1])*0.65;nd=Math.min(nd,Math.sqrt(dx*dx+dy*dy))});
      var cont=prev>=0&&A[prev][i]?0:0.03,sc=nd-0.25*pt[0]+(ti===prev?-0.035:cont);if(sc<bs){bs=sc;best=ti}});
    prev=best;car.push(best);var bp=A[best][i];ball.push([bp[0]+0.012,bp[1]])}
  // carrier changes held for one frame are noise
  if(p.ballSrc!=="radar")for(i=1;i<N-1;i++)if(car[i-1]===car[i+1]&&car[i]!==car[i-1]){car[i]=car[i-1];var bp2=A[car[i]][i];ball[i]=[bp2[0]+0.012,bp2[1]]}
  var ty=moType(m),ev=N-1;
  if(ty==="goal"||ty==="chance"){var gy=ty==="goal"?0.5:(ball[N-1][1]<0.5?0.36:0.64);ball.push([1.0,gy]);car.push(-1);ev=N;A=A.map(function(t){return t.concat([t[N-1]])});D=D.map(function(t){return t.concat([t[N-1]])});N++}
  var us=(p.att===user),out={v:1,src:"radar",fps:3,n:N,ev:ev,ty:ty,att:us?"u":"o",conf:Math.round(p.conf*100)/100,
    u:(us?A:D).map(function(t){return t.map(function(pt){return [q(pt[0]),q(pt[1])]})}),
    o:(us?D:A).map(function(t){return t.map(function(pt){return [q(pt[0]),q(pt[1])]})}),
    b:ball.map(function(pt){return [q(pt[0]),q(pt[1])]}),c:car,ball:p.ballSrc==="radar"?"radar":"est"};if(W.R2W_DEBUG){out.dbg={flip:p.flip,t0:p.t0,attRaw:p.attRadar,user:user}}
  return out}
function moType(m){var w=String(m.what||"");if(/هدف|أهداف|الشباك|سجّل|سجل|يسجل|أحرز|إحراز/.test(w))return "goal";if(/فرصة|تسديد|انفراد|رأسية|القائم|العارضة/.test(w))return "chance";return m.kind==="good"?"attack":"mistake"}
W.R2WRadar={extract:extract,moType:moType};
})(window);

/* RP v34 — animated attack replay: a top-down pitch, two teams as dots, the ball and its trail.
   Real replays come from the radar of the player's own clip (numbers only); without them an illustrative
   animation for the moment's type is shown and always labelled «محاكاة توضيحية». */
(function(W){"use strict";
var NS="http://www.w3.org/2000/svg",PW=1050,PH=680,PLAYING=null;
function E(n,a,p){var e=document.createElementNS(NS,n);if(a)for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function H(n,c,t){var e=document.createElement(n);if(c)e.className=c;if(t!=null)e.textContent=t;return e}
var UID=0;
function pitch(svg,id){
  var d=E("defs",null,svg);
  var lg=E("linearGradient",{id:"rpg"+id,x1:0,y1:0,x2:0,y2:1},d);E("stop",{offset:0,"stop-color":"#1d556b"},lg);E("stop",{offset:1,"stop-color":"#155a37"},lg);
  var rg=E("radialGradient",{id:"rpv"+id,cx:"50%",cy:"50%",r:"75%"},d);E("stop",{offset:"60%","stop-color":"#000","stop-opacity":0},rg);E("stop",{offset:"100%","stop-color":"#000","stop-opacity":.38},rg);
  var mk=E("marker",{id:"rpa"+id,viewBox:"0 0 10 10",refX:8,refY:5,markerWidth:5,markerHeight:5,orient:"auto-start-reverse"},d);E("path",{d:"M0 0L10 5L0 10z",fill:"#ffd166"},mk);
  var sh=E("filter",{id:"rps"+id,x:"-50%",y:"-50%",width:"200%",height:"200%"},d);E("feDropShadow",{dx:0,dy:3,stdDeviation:3,"flood-color":"#000","flood-opacity":.45},sh);
  E("rect",{x:-40,y:-40,width:PW+80,height:PH+80,fill:"url(#rpg"+id+")"},svg);
  for(var i=0;i<12;i++)if(i%2)E("rect",{x:i*PW/12,y:-40,width:PW/12,height:PH+80,fill:"#ffffff","fill-opacity":.045},svg);
  var g=E("g",{fill:"none",stroke:"#eaf6ee","stroke-opacity":.82,"stroke-width":3},svg);
  E("rect",{x:0,y:0,width:PW,height:PH},g);E("line",{x1:PW/2,y1:0,x2:PW/2,y2:PH},g);E("circle",{cx:PW/2,cy:PH/2,r:91.5},g);
  [0,1].forEach(function(s){var x=s?PW:0,dir=s?-1:1;
    E("rect",{x:s?PW-165:0,y:PH/2-201.5,width:165,height:403},g);E("rect",{x:s?PW-55:0,y:PH/2-91.5,width:55,height:183},g);
    E("path",{d:"M"+(x+dir*165)+" "+(PH/2-73)+"A91.5 91.5 0 0 "+(s?0:1)+" "+(x+dir*165)+" "+(PH/2+73)},g);
    E("rect",{x:s?PW:-14,y:PH/2-36.6,width:14,height:73.2,"stroke-opacity":.9},g);
    E("circle",{cx:x+dir*110,cy:PH/2,r:3.5,fill:"#eaf6ee",stroke:"none"},g)});
  E("circle",{cx:PW/2,cy:PH/2,r:4,fill:"#eaf6ee",stroke:"none"},g);
  [[0,0,0],[PW,0,1],[0,PH,3],[PW,PH,2]].forEach(function(c){var r=10,sx=c[0]?-1:1,sy=c[1]?-1:1;E("path",{d:"M"+(c[0]+sx*r)+" "+c[1]+"A"+r+" "+r+" 0 0 "+((sx*sy>0)?1:0)+" "+c[0]+" "+(c[1]+sy*r)},g)});
  E("rect",{x:-40,y:-40,width:PW+80,height:PH+80,fill:"url(#rpv"+id+")","pointer-events":"none"},svg)}
function cr(p0,p1,p2,p3,t){var t2=t*t,t3=t2*t;return 0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3)}
function at(arr,f){var n=arr.length;if(!n)return null;f=Math.max(0,Math.min(n-1,f));var i=Math.floor(f),t=f-i;
  var a=arr[Math.max(0,i-1)],b=arr[i],c=arr[Math.min(n-1,i+1)],d=arr[Math.min(n-1,i+2)];if(!b)return null;a=a||b;c=c||b;d=d||c;
  return [cr(a[0],b[0],c[0],d[0],t),cr(a[1],b[1],c[1],d[1],t)]}
function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
function ballAt(R,f){var n=R.b.length;f=Math.max(0,Math.min(n-1,f));var i=Math.floor(f),t=f-i,j=Math.min(n-1,i+1);
  var pass=R.c&&R.c[j]!==R.c[i];if(pass)t=ease(t);var a=R.b[i],b=R.b[j];if(!pass)return at(R.b,f);return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]}
var EV={goal:"⚽ هدف",chance:"🎯 تسديدة",attack:"⚡ الهجمة",mistake:"⚠️ الخطأ"};
function mount(host,R,o){o=o||{};var id=++UID,real=R.src==="radar";
  var wrap=H("div","rp-wrap"),stage=H("div","rp-stage"),svg=E("svg",{viewBox:"-14 -14 "+(PW+28)+" "+(PH+28),class:"rp-svg",role:"img","aria-label":real?"إعادة الهجمة من رادار مباراتك":"محاكاة توضيحية للهجمة"});
  stage.appendChild(svg);wrap.appendChild(stage);pitch(svg,id);
  var sx=function(x){return x/1000*PW},sy=function(y){return y/1000*PH};
  var gPass=E("g",null,svg),gTrail=E("g",{fill:"none","stroke-linecap":"round"},svg),gO=E("g",{class:"rp-o"},svg),gU=E("g",{class:"rp-u"},svg),gFx=E("g",null,svg);
  var halo=E("circle",{r:27,fill:"none",stroke:"#ffd166","stroke-width":3.5,"stroke-opacity":.95,class:"rp-halo"},gFx);
  var mkDots=function(arr,g,cls){return arr.map(function(){var c=E("g",{class:cls},g);E("circle",{r:16,filter:"url(#rps"+id+")"},c);return c})};
  var dO=mkDots(R.o,gO,"rp-dot o"),dU=mkDots(R.u,gU,"rp-dot u");
  var TR=14,trail=[];for(var i=0;i<TR;i++)trail.push(E("line",{stroke:"#ffd166","stroke-width":(7-i*0.4).toFixed(1),"stroke-opacity":(0.75*(1-i/TR)).toFixed(2)},gTrail));
  var ball=E("g",{class:"rp-ball"},svg);E("circle",{r:9.5,fill:"#ffffff",stroke:"#0b1118","stroke-width":2.2,filter:"url(#rps"+id+")"},ball);E("circle",{r:3.2,fill:"#0b1118"},ball);
  var pulse=E("circle",{r:12,fill:"none",stroke:"#ffd166","stroke-width":5,opacity:0},svg),pulse2=E("circle",{r:12,fill:"none",stroke:"#ffffff","stroke-width":3,opacity:0},svg);
  var badge=H("span","rp-badge"+(real?" real":" demo"),real?"📡 من رادار مباراتك":"محاكاة توضيحية");stage.appendChild(badge);
  var evc=H("span","rp-ev",EV[R.ty]||EV.attack);stage.appendChild(evc);
  var leg=H("span","rp-leg");leg.innerHTML='<i class="u"></i>فريقك<i class="o"></i>الخصم';stage.appendChild(leg);
  var ctl=H("div","rp-ctl"),pb=H("button","rp-play");pb.type="button";pb.setAttribute("aria-label","تشغيل");var rng=H("input","rp-rng");rng.type="range";rng.min=0;rng.max=1000;rng.value=0;rng.dir="ltr";rng.setAttribute("aria-label","زمن الإعادة");
  var spd=H("button","rp-spd","١×");spd.type="button";spd.setAttribute("aria-label","السرعة");ctl.appendChild(pb);ctl.appendChild(rng);ctl.appendChild(spd);wrap.appendChild(ctl);
  host.appendChild(wrap);
  var N=R.n,fps=R.fps||3,dur=(N-1)/fps,T=0,rate=1,raf=0,last=0,playing=false,ended=false,passes=[];
  // pass list: carrier changes between two players of the attacking side
  for(i=1;i<N;i++)if(R.c&&R.c[i]!==R.c[i-1]&&R.c[i-1]>=0){passes.push({f0:i-1,f1:i,shot:R.c[i]<0})}
  var pl=passes.map(function(p){var b0=R.b[p.f0],b1=R.b[p.f1];return E("line",{x1:sx(b0[0]),y1:sy(b0[1]),x2:sx(b1[0]),y2:sy(b1[1]),stroke:p.shot?"#ffd166":"#ffffff","stroke-width":p.shot?4.5:3,"stroke-dasharray":p.shot?"":"10 9","marker-end":"url(#rpa"+id+")",opacity:0},gPass)});
  var att=R.att==="u"?R.u:R.o;
  function draw(){var f=T*fps;
    R.u.forEach(function(t,k){var p=at(t,f);if(p)dU[k].setAttribute("transform","translate("+sx(p[0]).toFixed(1)+" "+sy(p[1]).toFixed(1)+")")});
    R.o.forEach(function(t,k){var p=at(t,f);if(p)dO[k].setAttribute("transform","translate("+sx(p[0]).toFixed(1)+" "+sy(p[1]).toFixed(1)+")")});
    var b=ballAt(R,f),bx=sx(b[0]),by=sy(b[1]);ball.setAttribute("transform","translate("+bx.toFixed(1)+" "+by.toFixed(1)+")");
    var prev=[bx,by];for(var k=0;k<TR;k++){var q=ballAt(R,Math.max(0,f-(k+1)*0.33)),qx=sx(q[0]),qy=sy(q[1]);trail[k].setAttribute("x1",prev[0].toFixed(1));trail[k].setAttribute("y1",prev[1].toFixed(1));trail[k].setAttribute("x2",qx.toFixed(1));trail[k].setAttribute("y2",qy.toFixed(1));prev=[qx,qy]}
    var ci=R.c?R.c[Math.min(N-1,Math.round(f))]:-1,cp=ci>=0&&att[ci]?at(att[ci],f):null;
    if(cp){halo.setAttribute("cx",sx(cp[0]).toFixed(1));halo.setAttribute("cy",sy(cp[1]).toFixed(1));halo.setAttribute("opacity",1)}else halo.setAttribute("opacity",0);
    passes.forEach(function(p,k){var a=f<p.f0?0:f<p.f1?Math.min(1,(f-p.f0)*1.6):Math.max(0,1-(f-p.f1)/(p.shot?6:4.5));pl[k].setAttribute("opacity",a.toFixed(2))});
    var ev=R.ev!=null?R.ev:N-1,dt=f-ev;
    if(dt>=-0.1){var ph=(dt*0.55)%1,ph2=((dt*0.55)+0.45)%1;[[pulse,ph,1],[pulse2,ph2,.7]].forEach(function(z){z[0].setAttribute("cx",bx.toFixed(1));z[0].setAttribute("cy",by.toFixed(1));z[0].setAttribute("r",(14+z[1]*70).toFixed(1));z[0].setAttribute("opacity",((1-z[1])*z[2]).toFixed(2))});evc.classList.add("on")}
    else{pulse.setAttribute("opacity",0);pulse2.setAttribute("opacity",0);evc.classList.remove("on")}
    rng.value=Math.round(T/(dur+HOLD)*1000)}
  var HOLD=1.6;
  function icon(){pb.innerHTML=playing?'<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>':ended?'<svg viewBox="0 0 24 24"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"/></svg>':'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';pb.setAttribute("aria-label",playing?"إيقاف مؤقت":ended?"إعادة":"تشغيل")}
  function tick(ts){if(!playing)return;var dt=last?Math.min(0.05,(ts-last)/1000):0;last=ts;T+=dt*rate;if(T>=dur+HOLD){T=dur+HOLD;playing=false;ended=true;draw();icon();wrap.classList.remove("on");return}draw();raf=requestAnimationFrame(tick)}
  function play(){if(PLAYING&&PLAYING!==api)PLAYING.pause();PLAYING=api;if(ended||T>=dur+HOLD){T=0;ended=false}playing=true;last=0;wrap.classList.add("on");icon();raf=requestAnimationFrame(tick)}
  function pause(){playing=false;cancelAnimationFrame(raf);wrap.classList.remove("on");icon()}
  pb.addEventListener("click",function(e){e.stopPropagation();playing?pause():play()});
  spd.addEventListener("click",function(e){e.stopPropagation();rate=rate===1?0.5:rate===0.5?1.5:1;spd.textContent=rate===1?"١×":rate===0.5?"٠٫٥×":"١٫٥×"});
  rng.addEventListener("input",function(e){e.stopPropagation();pause();T=(+rng.value/1000)*(dur+HOLD);ended=T>=dur+HOLD;draw();icon()});
  ["click","pointerdown","touchstart"].forEach(function(ev){ctl.addEventListener(ev,function(e){e.stopPropagation()},{passive:true});stage.addEventListener(ev,function(e){if(ev==="click"){e.stopPropagation();playing?pause():play()}},{passive:true})});
  var api={play:play,pause:pause,el:wrap,seek:function(t){T=t;draw()},destroy:function(){pause();if(io)io.disconnect();wrap.remove()}};
  var io=null,seen=false;if(o.autoplay!==false&&"IntersectionObserver" in W){io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting&&x.intersectionRatio>=0.6){if(!seen){seen=true;play()}}else if(playing&&x.intersectionRatio<0.2)pause()})},{threshold:[0,0.2,0.6,1]});io.observe(stage)}
  draw();icon();return api}
/* ---------- illustrative animations (always labelled) ---------- */
function rnd(seed){var s=0;for(var i=0;i<seed.length;i++)s=(s*31+seed.charCodeAt(i))>>>0;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296}}
var F433=[[.06,.5],[.27,.16],[.24,.38],[.24,.62],[.27,.84],[.45,.3],[.42,.5],[.45,.7],[.66,.18],[.7,.5],[.66,.82]];
var F442=[[.95,.5],[.8,.18],[.83,.4],[.83,.6],[.8,.82],[.66,.2],[.68,.42],[.68,.58],[.66,.8],[.55,.42],[.55,.6]];
// touches: [time(s), playerIndex, x, y]  (attack goes to the right; ball ends at x=1 for a goal)
var SCR={
  attack:[[0,6,.44,.5],[1.4,5,.55,.3],[2.6,8,.74,.12],[4.2,8,.88,.14],[5.4,9,.87,.46],[6.3,-1,.99,.42]],
  goal:[[0,6,.46,.52],[1.2,7,.58,.64],[2.4,9,.70,.5],[3.5,9,.82,.47],[4.6,9,.89,.5],[5.5,-1,1.0,.5]],
  chance:[[0,5,.5,.34],[1.3,6,.62,.5],[2.5,10,.76,.8],[3.6,10,.8,.66],[4.4,9,.82,.52],[5.3,-1,1.0,.6]],
  mistake:[[0,6,.38,.5],[1.0,6,.47,.54],[1.8,7,.55,.58],[2.8,9,.68,.52],[3.8,9,.8,.46],[4.9,9,.86,.5],[5.8,-1,.99,.44]]};
function illustrate(ty,kind,seed){ty=SCR[ty]?ty:"attack";var r=rnd(String(seed||ty)),sc=SCR[ty],dur=sc[sc.length-1][0]+0.3,fps=3,N=Math.round(dur*fps)+1;
  var jit=function(){return (r()-.5)*0.03};
  var A0=F433.map(function(p){return [p[0]+jit(),p[1]+jit()]}),D0=F442.map(function(p){return [p[0]+jit(),p[1]+jit()]});
  var touch=sc.map(function(s){return {t:s[0],i:s[1],p:[s[2]+(s[1]>=0?jit():0),s[3]+(s[1]>=0?jit():0)]}});
  function ballP(t){for(var k=0;k<touch.length-1;k++){var a=touch[k],b=touch[k+1];if(t<=b.t){var u=(t-a.t)/(b.t-a.t);var carry=a.i===b.i;u=carry?u:ease(u);return [a.p[0]+(b.p[0]-a.p[0])*u,a.p[1]+(b.p[1]-a.p[1])*u]}}return touch[touch.length-1].p}
  function carrier(t){for(var k=touch.length-1;k>=0;k--)if(t>=touch[k].t)return k<touch.length-1||touch[k].i<0?touch[k].i:touch[k].i;return touch[0].i}
  var A=A0.map(function(){return []}),D=D0.map(function(){return []}),B=[],C=[];
  for(var f=0;f<N;f++){var t=f/fps,b=ballP(t),prog=Math.min(1,t/dur);
    var ap=A0.map(function(p,i){var x=p[0]+(i?0.18*prog+0.05:0.03*prog),y=p[1]+(b[1]-0.5)*0.18*(i?1:0);
      var w=0,tx=0,ty2=0;touch.forEach(function(q){if(q.i!==i)return;var g=Math.exp(-Math.pow((t-q.t)/0.85,2));if(g>w){w=g;tx=q.p[0];ty2=q.p[1]}});
      if(w>0){x=x*(1-w)+tx*w;y=y*(1-w)+ty2*w}return [Math.min(.97,x),Math.max(.04,Math.min(.96,y))]});
    var ci=carrier(t);if(ci>=0){var cpos=ballP(t);ap[ci]=[cpos[0]-0.012,cpos[1]]}
    var dp=D0.map(function(p,i){var x=p[0]-(i?0.05*prog:0),y=p[1]+(b[1]-0.5)*(i?0.22:0.08);x=x+(b[0]-0.6)*0.12*(i?1:0);
      if(i){var best=null,bd=0.2;ap.forEach(function(q,qi){if(!qi)return;var d=Math.hypot(q[0]-x,(q[1]-y)*0.65);if(d<bd){bd=d;best=q}});if(best){x+= (best[0]+0.03-x)*0.45;y+=(best[1]-y)*0.45}}
      return [Math.max(.03,Math.min(.985,x)),Math.max(.04,Math.min(.96,y))]});
    if(f>0){var cp=ballP(t);var nd=-1,dd=1e9;dp.forEach(function(q,qi){if(!qi)return;var d=Math.hypot(q[0]-cp[0],q[1]-cp[1]);if(d<dd){dd=d;nd=qi}});if(nd>0&&ty!=="goal"){dp[nd]=[dp[nd][0]+(cp[0]+0.04-dp[nd][0])*0.35,dp[nd][1]+(cp[1]-dp[nd][1])*0.35]}}
    ap.forEach(function(p,i){A[i].push(p)});dp.forEach(function(p,i){D[i].push(p)});B.push(b);C.push(ci)}
  // goalkeeper dives to the ball's side at the end
  var gk=D[0];for(f=N-5;f<N;f++){if(f<0)continue;var bb=B[N-1];gk[f]=[gk[f][0]+(0.985-gk[f][0])*0.5,gk[f][1]+(bb[1]-gk[f][1])*(f-(N-5))/5*(ty==="goal"?0.55:0.9)]}
  var q=function(p){return [Math.round(p[0]*1000),Math.round(p[1]*1000)]};
  var userAtt=ty==="mistake"?false:kind==="good";
  // the ball "carrier" index for the halo/pass lines refers to the attacking side
  var Cq=C.map(function(c){return c});
  return {v:1,src:"demo",fps:fps,n:N,ev:N-1,ty:ty,att:userAtt?"u":"o",u:(userAtt?A:D).map(function(t){return t.map(q)}),o:(userAtt?D:A).map(function(t){return t.map(q)}),b:B.map(q),c:Cq}}
W.R2WReplay={mount:mount,illustrate:illustrate};
})(window);
