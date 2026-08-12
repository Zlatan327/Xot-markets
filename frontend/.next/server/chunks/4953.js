"use strict";exports.id=4953,exports.ids=[4953],exports.modules={9059:(a,b,c)=>{var d=c(53478),e=c(96313),f=c(42353);c(41686);var g=c(58003),h=c(33440),i=c(38051);let j=(0,i.AH)`
  :host {
    position: relative;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    padding: ${({spacing:a})=>a[1]};
  }

  /* -- Colors --------------------------------------------------- */
  button[data-type='accent'] wui-icon {
    color: ${({tokens:a})=>a.core.iconAccentPrimary};
  }

  button[data-type='neutral'][data-variant='primary'] wui-icon {
    color: ${({tokens:a})=>a.theme.iconInverse};
  }

  button[data-type='neutral'][data-variant='secondary'] wui-icon {
    color: ${({tokens:a})=>a.theme.iconDefault};
  }

  button[data-type='success'] wui-icon {
    color: ${({tokens:a})=>a.core.iconSuccess};
  }

  button[data-type='error'] wui-icon {
    color: ${({tokens:a})=>a.core.iconError};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='xs'] {
    width: 16px;
    height: 16px;

    border-radius: ${({borderRadius:a})=>a[1]};
  }

  button[data-size='sm'] {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:a})=>a[1]};
  }

  button[data-size='md'] {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:a})=>a[2]};
  }

  button[data-size='lg'] {
    width: 28px;
    height: 28px;
    border-radius: ${({borderRadius:a})=>a[2]};
  }

  button[data-size='xs'] wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] wui-icon {
    width: 20px;
    height: 20px;
  }

  /* -- Hover --------------------------------------------------- */
  @media (hover: hover) {
    button[data-type='accent']:hover:enabled {
      background-color: ${({tokens:a})=>a.core.foregroundAccent010};
    }

    button[data-variant='primary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:a})=>a.theme.foregroundSecondary};
    }

    button[data-variant='secondary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:a})=>a.theme.foregroundSecondary};
    }

    button[data-type='success']:hover:enabled {
      background-color: ${({tokens:a})=>a.core.backgroundSuccess};
    }

    button[data-type='error']:hover:enabled {
      background-color: ${({tokens:a})=>a.core.backgroundError};
    }
  }

  /* -- Focus --------------------------------------------------- */
  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:a})=>a.core.foregroundAccent020};
  }

  /* -- Properties --------------------------------------------------- */
  button[data-full-width='true'] {
    width: 100%;
  }

  :host([fullWidth]) {
    width: 100%;
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var k=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let l=class extends d.WF{constructor(){super(...arguments),this.icon="card",this.variant="primary",this.type="accent",this.size="md",this.iconSize=void 0,this.fullWidth=!1,this.disabled=!1}render(){return(0,d.qy)`<button
      data-variant=${this.variant}
      data-type=${this.type}
      data-size=${this.size}
      data-full-width=${this.fullWidth}
      ?disabled=${this.disabled}
    >
      <wui-icon color="inherit" name=${this.icon} size=${(0,f.J)(this.iconSize)}></wui-icon>
    </button>`}};l.styles=[g.W5,g.fD,j],k([(0,e.MZ)()],l.prototype,"icon",void 0),k([(0,e.MZ)()],l.prototype,"variant",void 0),k([(0,e.MZ)()],l.prototype,"type",void 0),k([(0,e.MZ)()],l.prototype,"size",void 0),k([(0,e.MZ)()],l.prototype,"iconSize",void 0),k([(0,e.MZ)({type:Boolean})],l.prototype,"fullWidth",void 0),k([(0,e.MZ)({type:Boolean})],l.prototype,"disabled",void 0),l=k([(0,h.E)("wui-icon-button")],l)},25786:(a,b,c)=>{c(87922)},94953:(a,b,c)=>{c.r(b),c.d(b,{PayController:()=>as,W3mPayLoadingView:()=>aJ,W3mPayQuoteView:()=>a$,W3mPayView:()=>av,arbitrumUSDC:()=>bb,arbitrumUSDT:()=>bg,baseETH:()=>a6,baseSepoliaETH:()=>a8,baseUSDC:()=>a7,ethereumUSDC:()=>a9,ethereumUSDT:()=>be,getExchanges:()=>a1,getIsPaymentInProgress:()=>a4,getPayError:()=>a3,getPayResult:()=>a2,openPay:()=>a_,optimismUSDC:()=>ba,optimismUSDT:()=>bf,pay:()=>a0,polygonUSDC:()=>bc,polygonUSDT:()=>bh,solanaSOL:()=>bj,solanaUSDC:()=>bd,solanaUSDT:()=>bi});var d=c(53478),e=c(96313),f=c(42353),g=c(89608),h=c(37662),i=c(78743),j=c(62970),k=c(40702),l=c(66407),m=c(99257),n=c(96214);c(85087),c(64436),c(52958),c(9059),c(95767),c(25786),c(72715),c(23155),c(49774),c(8547),c(82268),c(80282);var o=c(71579),p=c(45149),q=c(33198),r=c(38912),s=c(57508),t=c(85126),u=c(63860),v=c(21925),w=c(28020);let x="INVALID_PAYMENT_CONFIG",y="INVALID_RECIPIENT",z="INVALID_ASSET",A="INVALID_AMOUNT",B="UNABLE_TO_INITIATE_PAYMENT",C="INVALID_CHAIN_NAMESPACE",D="GENERIC_PAYMENT_ERROR",E="UNABLE_TO_GET_EXCHANGES",F="ASSET_NOT_SUPPORTED",G="UNABLE_TO_GET_PAY_URL",H="UNABLE_TO_GET_BUY_STATUS",I="UNABLE_TO_GET_QUOTE",J="UNABLE_TO_GET_QUOTE_STATUS",K="INVALID_RECIPIENT_ADDRESS_FOR_ASSET",L={[x]:"Invalid payment configuration",[y]:"Invalid recipient address",[z]:"Invalid asset specified",[A]:"Invalid payment amount",[K]:"Invalid recipient address for the asset selected",UNKNOWN_ERROR:"Unknown payment error occurred",[B]:"Unable to initiate payment",[C]:"Invalid chain namespace",[D]:"Unable to process payment",[E]:"Unable to get exchanges",[F]:"Asset not supported by the selected exchange",[G]:"Unable to get payment URL",[H]:"Unable to get buy status",UNABLE_TO_GET_TOKEN_BALANCES:"Unable to get token balances",[I]:"Unable to get quote. Please choose a different token",[J]:"Unable to get quote status"};class M extends Error{get message(){return L[this.code]}constructor(a,b){super(L[a]),this.name="AppKitPayError",this.code=a,this.details=b,Error.captureStackTrace&&Error.captureStackTrace(this,M)}}var N=c(30135),O=c(5645),P=c(44662);let Q="reown_test";var R=c(89e3),S=c(28410);async function T(a,b,c){if(b!==q.o.CHAIN.EVM)throw new M(C);if(!c.fromAddress)throw new M(x,"fromAddress is required for native EVM payments.");let d="string"==typeof c.amount?parseFloat(c.amount):c.amount;if(isNaN(d))throw new M(x);let e=a.metadata?.decimals??18,f=l.x.parseUnits(d.toString(),e);if("bigint"!=typeof f)throw new M(D);return await l.x.sendTransaction({chainNamespace:b,to:c.recipient,address:c.fromAddress,value:f,data:"0x"})??void 0}async function U(a,b){if(!b.fromAddress)throw new M(x,"fromAddress is required for ERC20 EVM payments.");let c=a.asset,d=b.recipient,e=Number(a.metadata.decimals),f=l.x.parseUnits(b.amount.toString(),e);if(void 0===f)throw new M(D);return await l.x.writeContract({fromAddress:b.fromAddress,tokenAddress:c,args:[d,f],method:"transfer",abi:R.v.getERC20Abi(c),chainNamespace:q.o.CHAIN.EVM})??void 0}async function V(a,b){if(a!==q.o.CHAIN.SOLANA)throw new M(C);if(!b.fromAddress)throw new M(x,"fromAddress is required for Solana payments.");let c="string"==typeof b.amount?parseFloat(b.amount):b.amount;if(isNaN(c)||c<=0)throw new M(x,"Invalid payment amount.");try{if(!S.G.getProvider(a))throw new M(D,"No Solana provider available.");let d=await l.x.sendTransaction({chainNamespace:q.o.CHAIN.SOLANA,to:b.recipient,value:c,tokenMint:b.tokenMint});if(!d)throw new M(D,"Transaction failed.");return d}catch(a){if(a instanceof M)throw a;throw new M(D,`Solana payment failed: ${a}`)}}async function W({sourceToken:a,toToken:b,amount:c,recipient:d}){let e=l.x.parseUnits(c,a.metadata.decimals),f=l.x.parseUnits(c,b.metadata.decimals);return Promise.resolve({type:ao,origin:{amount:e?.toString()??"0",currency:a},destination:{amount:f?.toString()??"0",currency:b},fees:[{id:"service",label:"Service Fee",amount:"0",currency:b}],steps:[{requestId:ao,type:"deposit",deposit:{amount:e?.toString()??"0",currency:a.asset,receiver:d}}],timeInSeconds:6})}function X(a){if(!a)return null;let b=a.steps[0];return b&&b.type===ap?b:null}function Y(a,b=0){if(!a)return[];let c=a.steps.filter(a=>a.type===aq),d=c.filter((a,c)=>c+1>b);return c.length>0&&c.length<3?d:[]}let Z=new N.Z({baseUrl:u.w.getApiUrl(),clientId:null});class $ extends Error{}function _(){let{projectId:a,sdkType:b,sdkVersion:c}=O.H.state;return{projectId:a,st:b||"appkit",sv:c||"html-wagmi-4.2.2"}}async function aa(a,b){let c,d=(c=O.H.getSnapshot().projectId,`https://rpc.walletconnect.org/v1/json-rpc?projectId=${c}`),{sdkType:e,sdkVersion:f,projectId:g}=O.H.getSnapshot(),h={jsonrpc:"2.0",id:1,method:a,params:{...b||{},st:e,sv:f,projectId:g}},i=await fetch(d,{method:"POST",body:JSON.stringify(h),headers:{"Content-Type":"application/json"}}),j=await i.json();if(j.error)throw new $(j.error.message);return j}async function ab(a){return(await aa("reown_getExchanges",a)).result}async function ac(a){return(await aa("reown_getExchangePayUrl",a)).result}async function ad(a){return(await aa("reown_getExchangeBuyStatus",a)).result}async function ae(a){let b=s.S.bigNumber(a.amount).times(10**a.toToken.metadata.decimals).toString(),{chainId:c,chainNamespace:d}=r.C.parseCaipNetworkId(a.sourceToken.network),{chainId:e,chainNamespace:f}=r.C.parseCaipNetworkId(a.toToken.network),g="native"===a.sourceToken.asset?(0,P.NH)(d):a.sourceToken.asset,h="native"===a.toToken.asset?(0,P.NH)(f):a.toToken.asset;return await Z.post({path:"/appkit/v1/transfers/quote",body:{user:a.address,originChainId:c.toString(),originCurrency:g,destinationChainId:e.toString(),destinationCurrency:h,recipient:a.recipient,amount:b},params:_()})}async function af(a){let b=w.y.isLowerCaseMatch(a.sourceToken.network,a.toToken.network),c=w.y.isLowerCaseMatch(a.sourceToken.asset,a.toToken.asset);return b&&c?W(a):ae(a)}async function ag(a){return await Z.get({path:"/appkit/v1/transfers/status",params:{requestId:a.requestId,..._()}})}async function ah(a){return await Z.get({path:`/appkit/v1/transfers/assets/exchanges/${a}`,params:_()})}let ai=["eip155","solana"],aj={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}},ak={56:"714",204:"714"};function al(a,b){let{chainNamespace:c,chainId:d}=r.C.parseCaipNetworkId(a),e=aj[c];if(!e)throw Error(`Unsupported chain namespace for CAIP-19 formatting: ${c}`);let f=e.native.assetNamespace,g=e.native.assetReference;"native"!==b?(f=e.defaultTokenNamespace,g=b):"eip155"===c&&ak[d]&&(g=ak[d]);let h=`${c}:${d}`;return`${h}/${f}:${g}`}function am(a){let b=s.S.bigNumber(a,{safe:!0});return b.lt(.001)?"<0.001":b.round(4).toString()}let an="unknown",ao="direct-transfer",ap="deposit",aq="transaction",ar=(0,o.BX)({paymentAsset:{network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},recipient:"0x0",amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0,choice:"pay",tokenBalances:{[q.o.CHAIN.EVM]:[],[q.o.CHAIN.SOLANA]:[]},isFetchingTokenBalances:!1,selectedPaymentAsset:null,quote:void 0,quoteStatus:"waiting",quoteError:null,isFetchingQuote:!1,selectedExchange:void 0,exchangeUrlForQuote:void 0,requestId:void 0}),as={state:ar,subscribe:a=>(0,o.B1)(ar,()=>a(ar)),subscribeKey:(a,b)=>(0,p.u$)(ar,a,b),async handleOpenPay(a){this.resetState(),this.setPaymentConfig(a),this.initializeAnalytics(),function(){let{chainNamespace:a}=r.C.parseCaipNetworkId(as.state.paymentAsset.network);if(!u.w.isAddress(as.state.recipient,a))throw new M(K,`Provide valid recipient address for namespace "${a}"`)}(),await this.prepareTokenLogo(),ar.isConfigured=!0,t.E.sendEvent({type:"track",event:"PAY_MODAL_OPEN",properties:{exchanges:ar.exchanges,configuration:{network:ar.paymentAsset.network,asset:ar.paymentAsset.asset,recipient:ar.recipient,amount:ar.amount}}}),await k.W.open({view:"Pay"})},resetState(){ar.paymentAsset={network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},ar.recipient="0x0",ar.amount=0,ar.isConfigured=!1,ar.error=null,ar.isPaymentInProgress=!1,ar.isLoading=!1,ar.currentPayment=void 0,ar.selectedExchange=void 0,ar.exchangeUrlForQuote=void 0,ar.requestId=void 0},resetQuoteState(){ar.quote=void 0,ar.quoteStatus="waiting",ar.quoteError=null,ar.isFetchingQuote=!1,ar.requestId=void 0},setPaymentConfig(a){if(!a.paymentAsset)throw new M(x);try{ar.choice=a.choice??"pay",ar.paymentAsset=a.paymentAsset,ar.recipient=a.recipient,ar.amount=a.amount,ar.openInNewTab=a.openInNewTab??!0,ar.redirectUrl=a.redirectUrl,ar.payWithExchange=a.payWithExchange,ar.error=null}catch(a){throw new M(x,a.message)}},setSelectedPaymentAsset(a){ar.selectedPaymentAsset=a},setSelectedExchange(a){ar.selectedExchange=a},setRequestId(a){ar.requestId=a},setPaymentInProgress(a){ar.isPaymentInProgress=a},getPaymentAsset:()=>ar.paymentAsset,getExchanges:()=>ar.exchanges,async fetchExchanges(){try{ar.isLoading=!0,ar.exchanges=(await ab({page:0})).exchanges.slice(0,2)}catch(a){throw m.P.showError(L.UNABLE_TO_GET_EXCHANGES),new M(E)}finally{ar.isLoading=!1}},async getAvailableExchanges(a){try{let b=a?.asset&&a?.network?al(a.network,a.asset):void 0;return await ab({page:a?.page??0,asset:b,amount:a?.amount?.toString()})}catch(a){throw new M(E)}},async getPayUrl(a,b,c=!1){try{let d=Number(b.amount),e=await ac({exchangeId:a,asset:al(b.network,b.asset),amount:d.toString(),recipient:`${b.network}:${b.recipient}`});return t.E.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{source:"pay",exchange:{id:a},configuration:{network:b.network,asset:b.asset,recipient:b.recipient,amount:d},currentPayment:{type:"exchange",exchangeId:a},headless:c}}),c&&(this.initiatePayment(),t.E.sendEvent({type:"track",event:"PAY_INITIATED",properties:{source:"pay",paymentId:ar.paymentId||an,configuration:{network:b.network,asset:b.asset,recipient:b.recipient,amount:d},currentPayment:{type:"exchange",exchangeId:a}}})),e}catch(a){if(a instanceof Error&&a.message.includes("is not supported"))throw new M(F);throw Error(a.message)}},async generateExchangeUrlForQuote({exchangeId:a,paymentAsset:b,amount:c,recipient:d}){let e=await ac({exchangeId:a,asset:al(b.network,b.asset),amount:c.toString(),recipient:d});ar.exchangeSessionId=e.sessionId,ar.exchangeUrlForQuote=e.url},async openPayUrl(a,b,c=!1){try{let d=await this.getPayUrl(a.exchangeId,b,c);if(!d)throw new M(G);let e=a.openInNewTab??!0;return u.w.openHref(d.url,e?"_blank":"_self"),d}catch(a){throw a instanceof M?ar.error=a.message:ar.error=L.GENERIC_PAYMENT_ERROR,new M(G)}},async onTransfer({chainNamespace:a,fromAddress:b,toAddress:c,amount:d,paymentAsset:e}){if(ar.currentPayment={type:"wallet",status:"IN_PROGRESS"},!ar.isPaymentInProgress)try{this.initiatePayment();let f=h.W.getAllRequestedCaipNetworks().find(a=>a.caipNetworkId===e.network);if(!f)throw Error("Target network not found");let g=h.W.state.activeCaipNetwork;switch(!w.y.isLowerCaseMatch(g?.caipNetworkId,f.caipNetworkId)&&await h.W.switchActiveNetwork(f),a){case q.o.CHAIN.EVM:"native"===e.asset&&(ar.currentPayment.result=await T(e,a,{recipient:c,amount:d,fromAddress:b})),e.asset.startsWith("0x")&&(ar.currentPayment.result=await U(e,{recipient:c,amount:d,fromAddress:b})),ar.currentPayment.status="SUCCESS";break;case q.o.CHAIN.SOLANA:ar.currentPayment.result=await V(a,{recipient:c,amount:d,fromAddress:b,tokenMint:"native"===e.asset?void 0:e.asset}),ar.currentPayment.status="SUCCESS";break;default:throw new M(C)}}catch(a){throw a instanceof M?ar.error=a.message:ar.error=L.GENERIC_PAYMENT_ERROR,ar.currentPayment.status="FAILED",m.P.showError(ar.error),a}finally{ar.isPaymentInProgress=!1}},async onSendTransaction(a){try{let{namespace:b,transactionStep:c}=a;as.initiatePayment();let d=h.W.getAllRequestedCaipNetworks().find(a=>a.caipNetworkId===ar.paymentAsset?.network);if(!d)throw Error("Target network not found");let e=h.W.state.activeCaipNetwork;if(w.y.isLowerCaseMatch(e?.caipNetworkId,d.caipNetworkId)||await h.W.switchActiveNetwork(d),b===q.o.CHAIN.EVM){let{from:a,to:d,data:e,value:f}=c.transaction;await l.x.sendTransaction({address:a,to:d,data:e,value:BigInt(f),chainNamespace:b})}else if(b===q.o.CHAIN.SOLANA){let{instructions:a}=c.transaction;await l.x.writeSolanaTransaction({instructions:a})}}catch(a){throw a instanceof M?ar.error=a.message:ar.error=L.GENERIC_PAYMENT_ERROR,m.P.showError(ar.error),a}finally{ar.isPaymentInProgress=!1}},getExchangeById:a=>ar.exchanges.find(b=>b.id===a),validatePayConfig(a){let{paymentAsset:b,recipient:c,amount:d}=a;if(!b)throw new M(x);if(!c)throw new M(y);if(!b.asset)throw new M(z);if(null==d||d<=0)throw new M(A)},async handlePayWithExchange(a){try{ar.currentPayment={type:"exchange",exchangeId:a};let{network:b,asset:c}=ar.paymentAsset,d={network:b,asset:c,amount:ar.amount,recipient:ar.recipient},e=await this.getPayUrl(a,d);if(!e)throw new M(B);return ar.currentPayment.sessionId=e.sessionId,ar.currentPayment.status="IN_PROGRESS",ar.currentPayment.exchangeId=a,this.initiatePayment(),{url:e.url,openInNewTab:ar.openInNewTab}}catch(a){return a instanceof M?ar.error=a.message:ar.error=L.GENERIC_PAYMENT_ERROR,ar.isPaymentInProgress=!1,m.P.showError(ar.error),null}},async getBuyStatus(a,b){try{let c=await ad({sessionId:b,exchangeId:a});return("SUCCESS"===c.status||"FAILED"===c.status)&&t.E.sendEvent({type:"track",event:"SUCCESS"===c.status?"PAY_SUCCESS":"PAY_ERROR",properties:{message:"FAILED"===c.status?u.w.parseError(ar.error):void 0,source:"pay",paymentId:ar.paymentId||an,configuration:{network:ar.paymentAsset.network,asset:ar.paymentAsset.asset,recipient:ar.recipient,amount:ar.amount},currentPayment:{type:"exchange",exchangeId:ar.currentPayment?.exchangeId,sessionId:ar.currentPayment?.sessionId,result:c.txHash}}}),c}catch(a){throw new M(H)}},async fetchTokensFromEOA({caipAddress:a,caipNetwork:b,namespace:c}){if(!a)return[];let{address:d}=r.C.parseCaipAddress(a),e=b;return c===q.o.CHAIN.EVM&&(e=void 0),await v.Z.getMyTokensWithBalance({address:d,caipNetwork:e})},async fetchTokensFromExchange(){if(!ar.selectedExchange)return[];let a=Object.values((await ah(ar.selectedExchange.id)).assets).flat();return await Promise.all(a.map(async a=>{let b={chainId:a.network,address:`${a.network}:${a.asset}`,symbol:a.metadata.symbol,name:a.metadata.name,iconUrl:a.metadata.logoURI||"",price:0,quantity:{numeric:"0",decimals:a.metadata.decimals.toString()}},{chainNamespace:c}=r.C.parseCaipNetworkId(b.chainId),d=b.address;if(u.w.isCaipAddress(d)){let{address:a}=r.C.parseCaipAddress(d);d=a}return b.iconUrl=await i.$.getImageByToken(d??"",c).catch(()=>void 0)??"",b}))},async fetchTokens({caipAddress:a,caipNetwork:b,namespace:c}){try{ar.isFetchingTokenBalances=!0;let d=ar.selectedExchange?this.fetchTokensFromExchange():this.fetchTokensFromEOA({caipAddress:a,caipNetwork:b,namespace:c}),e=await d;ar.tokenBalances={...ar.tokenBalances,[c]:e}}catch(b){let a=b instanceof Error?b.message:"Unable to get token balances";m.P.showError(a)}finally{ar.isFetchingTokenBalances=!1}},async fetchQuote({amount:a,address:b,sourceToken:c,toToken:d,recipient:e}){try{as.resetQuoteState(),ar.isFetchingQuote=!0;let f=await af({amount:a,address:ar.selectedExchange?void 0:b,sourceToken:c,toToken:d,recipient:e});if(ar.selectedExchange){let a=X(f);if(a){let b=`${c.network}:${a.deposit.receiver}`,d=s.S.formatNumber(a.deposit.amount,{decimals:c.metadata.decimals??0,round:8});await as.generateExchangeUrlForQuote({exchangeId:ar.selectedExchange.id,paymentAsset:c,amount:d.toString(),recipient:b})}}ar.quote=f}catch(b){let a=L.UNABLE_TO_GET_QUOTE;if(b instanceof Error&&b.cause&&b.cause instanceof Response)try{let c=await b.cause.json();c.error&&"string"==typeof c.error&&(a=c.error)}catch{}throw ar.quoteError=a,m.P.showError(a),new M(I)}finally{ar.isFetchingQuote=!1}},async fetchQuoteStatus({requestId:a}){try{if(a===ao){let a=ar.selectedExchange,b=ar.exchangeSessionId;if(a&&b){switch((await this.getBuyStatus(a.id,b)).status){case"IN_PROGRESS":case"UNKNOWN":default:ar.quoteStatus="waiting";break;case"SUCCESS":ar.quoteStatus="success",ar.isPaymentInProgress=!1;break;case"FAILED":ar.quoteStatus="failure",ar.isPaymentInProgress=!1}return}ar.quoteStatus="success";return}let{status:b}=await ag({requestId:a});ar.quoteStatus=b}catch{throw ar.quoteStatus="failure",new M(J)}},initiatePayment(){ar.isPaymentInProgress=!0,ar.paymentId=crypto.randomUUID()},initializeAnalytics(){ar.analyticsSet||(ar.analyticsSet=!0,this.subscribeKey("isPaymentInProgress",a=>{if(ar.currentPayment?.status&&"UNKNOWN"!==ar.currentPayment.status){let a={IN_PROGRESS:"PAY_INITIATED",SUCCESS:"PAY_SUCCESS",FAILED:"PAY_ERROR"}[ar.currentPayment.status];t.E.sendEvent({type:"track",event:a,properties:{message:"FAILED"===ar.currentPayment.status?u.w.parseError(ar.error):void 0,source:"pay",paymentId:ar.paymentId||an,configuration:{network:ar.paymentAsset.network,asset:ar.paymentAsset.asset,recipient:ar.recipient,amount:ar.amount},currentPayment:{type:ar.currentPayment.type,exchangeId:ar.currentPayment.exchangeId,sessionId:ar.currentPayment.sessionId,result:ar.currentPayment.result}}})}}))},async prepareTokenLogo(){if(!ar.paymentAsset.metadata.logoURI)try{let{chainNamespace:a}=r.C.parseCaipNetworkId(ar.paymentAsset.network),b=await i.$.getImageByToken(ar.paymentAsset.asset,a);ar.paymentAsset.metadata.logoURI=b}catch{}}},at=(0,n.AH)`
  wui-separator {
    margin: var(--apkt-spacing-3) calc(var(--apkt-spacing-3) * -1) var(--apkt-spacing-2)
      calc(var(--apkt-spacing-3) * -1);
    width: calc(100% + var(--apkt-spacing-3) * 2);
  }

  .token-display {
    padding: var(--apkt-spacing-3) var(--apkt-spacing-3);
    border-radius: var(--apkt-borderRadius-5);
    background-color: var(--apkt-tokens-theme-backgroundPrimary);
    margin-top: var(--apkt-spacing-3);
    margin-bottom: var(--apkt-spacing-3);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--apkt-spacing-2);
  }

  .left-image-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:a})=>a.round};
    width: 40px;
    height: 40px;
  }

  .chain-image {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:a})=>a.round};
    border: 2px solid ${({tokens:a})=>a.theme.backgroundPrimary};
  }

  .payment-methods-container {
    background-color: ${({tokens:a})=>a.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:a})=>a[8]};
    border-top-left-radius: ${({borderRadius:a})=>a[8]};
  }
`;var au=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let av=class extends d.WF{constructor(){super(),this.unsubscribe=[],this.amount=as.state.amount,this.namespace=void 0,this.paymentAsset=as.state.paymentAsset,this.activeConnectorIds=g.a.state.activeConnectorIds,this.caipAddress=void 0,this.exchanges=as.state.exchanges,this.isLoading=as.state.isLoading,this.initializeNamespace(),this.unsubscribe.push(as.subscribeKey("amount",a=>this.amount=a)),this.unsubscribe.push(g.a.subscribeKey("activeConnectorIds",a=>this.activeConnectorIds=a)),this.unsubscribe.push(as.subscribeKey("exchanges",a=>this.exchanges=a)),this.unsubscribe.push(as.subscribeKey("isLoading",a=>this.isLoading=a)),as.fetchExchanges(),as.setSelectedExchange(void 0)}disconnectedCallback(){this.unsubscribe.forEach(a=>a())}render(){return(0,d.qy)`
      <wui-flex flexDirection="column">
        ${this.paymentDetailsTemplate()} ${this.paymentMethodsTemplate()}
      </wui-flex>
    `}paymentMethodsTemplate(){return(0,d.qy)`
      <wui-flex flexDirection="column" padding="3" gap="2" class="payment-methods-container">
        ${this.payWithWalletTemplate()} ${this.templateSeparator()}
        ${this.templateExchangeOptions()}
      </wui-flex>
    `}initializeNamespace(){let a=h.W.state.activeChain;this.namespace=a,this.caipAddress=h.W.getAccountData(a)?.caipAddress,this.unsubscribe.push(h.W.subscribeChainProp("accountState",a=>{this.caipAddress=a?.caipAddress},a))}paymentDetailsTemplate(){let a=h.W.getAllRequestedCaipNetworks().find(a=>a.caipNetworkId===this.paymentAsset.network);return(0,d.qy)`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        .padding=${["6","8","6","8"]}
        gap="2"
      >
        <wui-flex alignItems="center" gap="1">
          <wui-text variant="h1-regular" color="primary">
            ${am(this.amount||"0")}
          </wui-text>

          <wui-flex flexDirection="column">
            <wui-text variant="h6-regular" color="secondary">
              ${this.paymentAsset.metadata.symbol||"Unknown"}
            </wui-text>
            <wui-text variant="md-medium" color="secondary"
              >on ${a?.name||"Unknown"}</wui-text
            >
          </wui-flex>
        </wui-flex>

        <wui-flex class="left-image-container">
          <wui-image
            src=${(0,f.J)(this.paymentAsset.metadata.logoURI)}
            class="token-image"
          ></wui-image>
          <wui-image
            src=${(0,f.J)(i.$.getNetworkImage(a))}
            class="chain-image"
          ></wui-image>
        </wui-flex>
      </wui-flex>
    `}payWithWalletTemplate(){return!function(a){let{chainNamespace:b}=r.C.parseCaipNetworkId(a);return ai.includes(b)}(this.paymentAsset.network)?(0,d.qy)``:this.caipAddress?this.connectedWalletTemplate():this.disconnectedWalletTemplate()}connectedWalletTemplate(){let{name:a,image:b}=this.getWalletProperties({namespace:this.namespace});return(0,d.qy)`
      <wui-flex flexDirection="column" gap="3">
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${this.onWalletPayment}
          .boxed=${!1}
          ?chevron=${!0}
          ?fullSize=${!1}
          ?rounded=${!0}
          data-testid="wallet-payment-option"
          imageSrc=${(0,f.J)(b)}
          imageSize="3xl"
        >
          <wui-text variant="lg-regular" color="primary">Pay with ${a}</wui-text>
        </wui-list-item>

        <wui-list-item
          type="secondary"
          icon="power"
          iconColor="error"
          @click=${this.onDisconnect}
          data-testid="disconnect-button"
          ?chevron=${!1}
          boxColor="foregroundSecondary"
        >
          <wui-text variant="lg-regular" color="secondary">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>
    `}disconnectedWalletTemplate(){return(0,d.qy)`<wui-list-item
      type="secondary"
      boxColor="foregroundSecondary"
      variant="icon"
      iconColor="default"
      iconVariant="overlay"
      icon="wallet"
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="lg-regular" color="primary">Pay with wallet</wui-text>
    </wui-list-item>`}templateExchangeOptions(){if(this.isLoading)return(0,d.qy)`<wui-flex justifyContent="center" alignItems="center">
        <wui-loading-spinner size="md"></wui-loading-spinner>
      </wui-flex>`;let a=this.exchanges.filter(a=>{var b;let c;return(b=this.paymentAsset,(c=h.W.getAllRequestedCaipNetworks().find(a=>a.caipNetworkId===b.network))&&c.testnet)?a.id===Q:a.id!==Q});return 0===a.length?(0,d.qy)`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="md-medium" color="primary">No exchanges available</wui-text>
      </wui-flex>`:a.map(a=>(0,d.qy)`
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${()=>this.onExchangePayment(a)}
          data-testid="exchange-option-${a.id}"
          ?chevron=${!0}
          imageSrc=${(0,f.J)(a.imageUrl)}
        >
          <wui-text flexGrow="1" variant="lg-regular" color="primary">
            Pay with ${a.name}
          </wui-text>
        </wui-list-item>
      `)}templateSeparator(){return(0,d.qy)`<wui-separator text="or" bgColor="secondary"></wui-separator>`}async onWalletPayment(){if(!this.namespace)throw Error("Namespace not found");this.caipAddress?j.I.push("PayQuote"):(await g.a.connect(),await k.W.open({view:"PayQuote"}))}onExchangePayment(a){as.setSelectedExchange(a),j.I.push("PayQuote")}async onDisconnect(){try{await l.x.disconnect(),await k.W.open({view:"Pay"})}catch{console.error("Failed to disconnect"),m.P.showError("Failed to disconnect")}}getWalletProperties({namespace:a}){if(!a)return{name:void 0,image:void 0};let b=this.activeConnectorIds[a];if(!b)return{name:void 0,image:void 0};let c=g.a.getConnector({id:b,namespace:a});if(!c)return{name:void 0,image:void 0};let d=i.$.getConnectorImage(c);return{name:c.name,image:d}}};av.styles=at,au([(0,e.wk)()],av.prototype,"amount",void 0),au([(0,e.wk)()],av.prototype,"namespace",void 0),au([(0,e.wk)()],av.prototype,"paymentAsset",void 0),au([(0,e.wk)()],av.prototype,"activeConnectorIds",void 0),au([(0,e.wk)()],av.prototype,"caipAddress",void 0),au([(0,e.wk)()],av.prototype,"exchanges",void 0),au([(0,e.wk)()],av.prototype,"isLoading",void 0),av=au([(0,n.EM)("w3m-pay-view")],av);var aw=c(52870),ax=c(38051),ay=c(58003),az=c(33440);let aA=(0,ax.AH)`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-container {
    position: relative;
    width: var(--pulse-size);
    height: var(--pulse-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-rings {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .pulse-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid var(--pulse-color);
    opacity: 0;
    animation: pulse var(--pulse-duration, 2s) ease-out infinite;
  }

  .pulse-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.5);
      opacity: var(--pulse-opacity, 0.3);
    }
    50% {
      opacity: calc(var(--pulse-opacity, 0.3) * 0.5);
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`;var aB=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let aC={"accent-primary":ax.f.tokens.core.backgroundAccentPrimary},aD=class extends d.WF{constructor(){super(...arguments),this.rings=3,this.duration=2,this.opacity=.3,this.size="200px",this.variant="accent-primary"}render(){let a=aC[this.variant];this.style.cssText=`
      --pulse-size: ${this.size};
      --pulse-duration: ${this.duration}s;
      --pulse-color: ${a};
      --pulse-opacity: ${this.opacity};
    `;let b=Array.from({length:this.rings},(a,b)=>this.renderRing(b,this.rings));return(0,d.qy)`
      <div class="pulse-container">
        <div class="pulse-rings">${b}</div>
        <div class="pulse-content">
          <slot></slot>
        </div>
      </div>
    `}renderRing(a,b){let c=a/b*this.duration,e=`animation-delay: ${c}s;`;return(0,d.qy)`<div class="pulse-ring" style=${e}></div>`}};aD.styles=[ay.W5,aA],aB([(0,e.MZ)({type:Number})],aD.prototype,"rings",void 0),aB([(0,e.MZ)({type:Number})],aD.prototype,"duration",void 0),aB([(0,e.MZ)({type:Number})],aD.prototype,"opacity",void 0),aB([(0,e.MZ)()],aD.prototype,"size",void 0),aB([(0,e.MZ)()],aD.prototype,"variant",void 0),aD=aB([(0,az.E)("wui-pulse")],aD);let aE=[{id:"received",title:"Receiving funds",icon:"dollar"},{id:"processing",title:"Swapping asset",icon:"recycleHorizontal"},{id:"sending",title:"Sending asset to the recipient address",icon:"send"}],aF=["success","submitted","failure","timeout","refund"],aG=(0,n.AH)`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }

  wui-image {
    border-radius: ${({borderRadius:a})=>a.round};
  }

  .token-badge-container {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: ${({borderRadius:a})=>a[4]};
    z-index: 3;
    min-width: 105px;
  }

  .token-badge-container.loading {
    background-color: ${({tokens:a})=>a.theme.backgroundPrimary};
    border: 3px solid ${({tokens:a})=>a.theme.backgroundPrimary};
  }

  .token-badge-container.success {
    background-color: ${({tokens:a})=>a.theme.backgroundPrimary};
    border: 3px solid ${({tokens:a})=>a.theme.backgroundPrimary};
  }

  .token-image-container {
    position: relative;
  }

  .token-image {
    border-radius: ${({borderRadius:a})=>a.round};
    width: 64px;
    height: 64px;
  }

  .token-image.success {
    background-color: ${({tokens:a})=>a.theme.foregroundPrimary};
  }

  .token-image.error {
    background-color: ${({tokens:a})=>a.theme.foregroundPrimary};
  }

  .token-image.loading {
    background: ${({colors:a})=>a.accent010};
  }

  .token-image wui-icon {
    width: 32px;
    height: 32px;
  }

  .token-badge {
    background-color: ${({tokens:a})=>a.theme.foregroundPrimary};
    border: 1px solid ${({tokens:a})=>a.theme.foregroundSecondary};
    border-radius: ${({borderRadius:a})=>a[4]};
  }

  .token-badge wui-text {
    white-space: nowrap;
  }

  .payment-lifecycle-container {
    background-color: ${({tokens:a})=>a.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:a})=>a[6]};
    border-top-left-radius: ${({borderRadius:a})=>a[6]};
  }

  .payment-step-badge {
    padding: ${({spacing:a})=>a[1]} ${({spacing:a})=>a[2]};
    border-radius: ${({borderRadius:a})=>a[1]};
  }

  .payment-step-badge.loading {
    background-color: ${({tokens:a})=>a.theme.foregroundSecondary};
  }

  .payment-step-badge.error {
    background-color: ${({tokens:a})=>a.core.backgroundError};
  }

  .payment-step-badge.success {
    background-color: ${({tokens:a})=>a.core.backgroundSuccess};
  }

  .step-icon-container {
    position: relative;
    height: 40px;
    width: 40px;
    border-radius: ${({borderRadius:a})=>a.round};
    background-color: ${({tokens:a})=>a.theme.foregroundSecondary};
  }

  .step-icon-box {
    position: absolute;
    right: -4px;
    bottom: -1px;
    padding: 2px;
    border-radius: ${({borderRadius:a})=>a.round};
    border: 2px solid ${({tokens:a})=>a.theme.backgroundPrimary};
    background-color: ${({tokens:a})=>a.theme.foregroundPrimary};
  }

  .step-icon-box.success {
    background-color: ${({tokens:a})=>a.core.backgroundSuccess};
  }
`;var aH=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let aI={received:["pending","success","submitted"],processing:["success","submitted"],sending:["success","submitted"]},aJ=class extends d.WF{constructor(){super(),this.unsubscribe=[],this.pollingInterval=null,this.paymentAsset=as.state.paymentAsset,this.quoteStatus=as.state.quoteStatus,this.quote=as.state.quote,this.amount=as.state.amount,this.namespace=void 0,this.caipAddress=void 0,this.profileName=null,this.activeConnectorIds=g.a.state.activeConnectorIds,this.selectedExchange=as.state.selectedExchange,this.initializeNamespace(),this.unsubscribe.push(as.subscribeKey("quoteStatus",a=>this.quoteStatus=a),as.subscribeKey("quote",a=>this.quote=a),g.a.subscribeKey("activeConnectorIds",a=>this.activeConnectorIds=a),as.subscribeKey("selectedExchange",a=>this.selectedExchange=a))}connectedCallback(){super.connectedCallback(),this.startPolling()}disconnectedCallback(){super.disconnectedCallback(),this.stopPolling(),this.unsubscribe.forEach(a=>a())}render(){return(0,d.qy)`
      <wui-flex flexDirection="column" .padding=${["3","0","0","0"]} gap="2">
        ${this.tokenTemplate()} ${this.paymentTemplate()} ${this.paymentLifecycleTemplate()}
      </wui-flex>
    `}tokenTemplate(){let a=am(this.amount||"0"),b=this.paymentAsset.metadata.symbol??"Unknown",c=h.W.getAllRequestedCaipNetworks().find(a=>a.caipNetworkId===this.paymentAsset.network),e="failure"===this.quoteStatus||"timeout"===this.quoteStatus||"refund"===this.quoteStatus;return"success"===this.quoteStatus||"submitted"===this.quoteStatus?(0,d.qy)`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image success">
          <wui-icon name="checkmark" color="success" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:e?(0,d.qy)`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image error">
          <wui-icon name="close" color="error" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:(0,d.qy)`
      <wui-flex alignItems="center" justifyContent="center">
        <wui-flex class="token-image-container">
          <wui-pulse size="125px" rings="3" duration="4" opacity="0.5" variant="accent-primary">
            <wui-flex justifyContent="center" alignItems="center" class="token-image loading">
              <wui-icon name="paperPlaneTitle" color="accent-primary" size="inherit"></wui-icon>
            </wui-flex>
          </wui-pulse>

          <wui-flex
            justifyContent="center"
            alignItems="center"
            class="token-badge-container loading"
          >
            <wui-flex
              alignItems="center"
              justifyContent="center"
              gap="01"
              padding="1"
              class="token-badge"
            >
              <wui-image
                src=${(0,f.J)(i.$.getNetworkImage(c))}
                class="chain-image"
                size="mdl"
              ></wui-image>

              <wui-text variant="lg-regular" color="primary">${a} ${b}</wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}paymentTemplate(){return(0,d.qy)`
      <wui-flex flexDirection="column" gap="2" .padding=${["0","6","0","6"]}>
        ${this.renderPayment()}
        <wui-separator></wui-separator>
        ${this.renderWallet()}
      </wui-flex>
    `}paymentLifecycleTemplate(){let a=this.getStepsWithStatus();return(0,d.qy)`
      <wui-flex flexDirection="column" padding="4" gap="2" class="payment-lifecycle-container">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">PAYMENT CYCLE</wui-text>

          ${this.renderPaymentCycleBadge()}
        </wui-flex>

        <wui-flex flexDirection="column" gap="5" .padding=${["2","0","2","0"]}>
          ${a.map(a=>this.renderStep(a))}
        </wui-flex>
      </wui-flex>
    `}renderPaymentCycleBadge(){let a="failure"===this.quoteStatus||"timeout"===this.quoteStatus||"refund"===this.quoteStatus,b="success"===this.quoteStatus||"submitted"===this.quoteStatus;if(a)return(0,d.qy)`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge error"
          gap="1"
        >
          <wui-icon name="close" color="error" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="error">Failed</wui-text>
        </wui-flex>
      `;if(b)return(0,d.qy)`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge success"
          gap="1"
        >
          <wui-icon name="checkmark" color="success" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="success">Completed</wui-text>
        </wui-flex>
      `;let c=this.quote?.timeInSeconds??0;return(0,d.qy)`
      <wui-flex alignItems="center" justifyContent="space-between" gap="3">
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge loading"
          gap="1"
        >
          <wui-icon name="clock" color="default" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="primary">Est. ${c} sec</wui-text>
        </wui-flex>

        <wui-icon name="chevronBottom" color="default" size="xxs"></wui-icon>
      </wui-flex>
    `}renderPayment(){let a=h.W.getAllRequestedCaipNetworks().find(a=>{let b=this.quote?.origin.currency.network;if(!b)return!1;let{chainId:c}=r.C.parseCaipNetworkId(b);return w.y.isLowerCaseMatch(a.id.toString(),c.toString())}),b=am(s.S.formatNumber(this.quote?.origin.amount||"0",{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString()),c=this.quote?.origin.currency.metadata.symbol??"Unknown";return(0,d.qy)`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${["3","0","3","0"]}
      >
        <wui-text variant="lg-regular" color="secondary">Payment Method</wui-text>

        <wui-flex flexDirection="column" alignItems="flex-end" gap="1">
          <wui-flex alignItems="center" gap="01">
            <wui-text variant="lg-regular" color="primary">${b}</wui-text>
            <wui-text variant="lg-regular" color="secondary">${c}</wui-text>
          </wui-flex>

          <wui-flex alignItems="center" gap="1">
            <wui-text variant="md-regular" color="secondary">on</wui-text>
            <wui-image
              src=${(0,f.J)(i.$.getNetworkImage(a))}
              size="xs"
            ></wui-image>
            <wui-text variant="md-regular" color="secondary">${a?.name}</wui-text>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderWallet(){return(0,d.qy)`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${["3","0","3","0"]}
      >
        <wui-text variant="lg-regular" color="secondary"
          >${this.selectedExchange?"Exchange":"Wallet"}</wui-text
        >

        ${this.renderWalletText()}
      </wui-flex>
    `}renderWalletText(){let{image:a}=this.getWalletProperties({namespace:this.namespace}),{address:b}=this.caipAddress?r.C.parseCaipAddress(this.caipAddress):{},c=this.selectedExchange?.name;return this.selectedExchange?(0,d.qy)`
        <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
          <wui-text variant="lg-regular" color="primary">${c}</wui-text>
          <wui-image src=${(0,f.J)(this.selectedExchange.imageUrl)} size="mdl"></wui-image>
        </wui-flex>
      `:(0,d.qy)`
      <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
        <wui-text variant="lg-regular" color="primary">
          ${n.Zv.getTruncateString({string:this.profileName||b||c||"",charsStart:this.profileName?16:4,charsEnd:6*!this.profileName,truncate:this.profileName?"end":"middle"})}
        </wui-text>

        <wui-image src=${(0,f.J)(a)} size="mdl"></wui-image>
      </wui-flex>
    `}getStepsWithStatus(){return"failure"===this.quoteStatus||"timeout"===this.quoteStatus||"refund"===this.quoteStatus?aE.map(a=>({...a,status:"failed"})):aE.map(a=>{let b=(aI[a.id]??[]).includes(this.quoteStatus)?"completed":"pending";return{...a,status:b}})}renderStep({title:a,icon:b,status:c}){return(0,d.qy)`
      <wui-flex alignItems="center" gap="3">
        <wui-flex justifyContent="center" alignItems="center" class="step-icon-container">
          <wui-icon name=${b} color="default" size="mdl"></wui-icon>

          <wui-flex alignItems="center" justifyContent="center" class=${(0,aw.H)({"step-icon-box":!0,success:"completed"===c})}>
            ${this.renderStatusIndicator(c)}
          </wui-flex>
        </wui-flex>

        <wui-text variant="md-regular" color="primary">${a}</wui-text>
      </wui-flex>
    `}renderStatusIndicator(a){return"completed"===a?(0,d.qy)`<wui-icon size="sm" color="success" name="checkmark"></wui-icon>`:"failed"===a?(0,d.qy)`<wui-icon size="sm" color="error" name="close"></wui-icon>`:"pending"===a?(0,d.qy)`<wui-loading-spinner color="accent-primary" size="sm"></wui-loading-spinner>`:null}startPolling(){this.pollingInterval||(this.fetchQuoteStatus(),this.pollingInterval=setInterval(()=>{this.fetchQuoteStatus()},3e3))}stopPolling(){this.pollingInterval&&(clearInterval(this.pollingInterval),this.pollingInterval=null)}async fetchQuoteStatus(){let a=as.state.requestId;if(!a||aF.includes(this.quoteStatus))this.stopPolling();else try{await as.fetchQuoteStatus({requestId:a}),aF.includes(this.quoteStatus)&&this.stopPolling()}catch{this.stopPolling()}}initializeNamespace(){let a=h.W.state.activeChain;this.namespace=a,this.caipAddress=h.W.getAccountData(a)?.caipAddress,this.profileName=h.W.getAccountData(a)?.profileName??null,this.unsubscribe.push(h.W.subscribeChainProp("accountState",a=>{this.caipAddress=a?.caipAddress,this.profileName=a?.profileName??null},a))}getWalletProperties({namespace:a}){if(!a)return{name:void 0,image:void 0};let b=this.activeConnectorIds[a];if(!b)return{name:void 0,image:void 0};let c=g.a.getConnector({id:b,namespace:a});if(!c)return{name:void 0,image:void 0};let d=i.$.getConnectorImage(c);return{name:c.name,image:d}}};aJ.styles=aG,aH([(0,e.wk)()],aJ.prototype,"paymentAsset",void 0),aH([(0,e.wk)()],aJ.prototype,"quoteStatus",void 0),aH([(0,e.wk)()],aJ.prototype,"quote",void 0),aH([(0,e.wk)()],aJ.prototype,"amount",void 0),aH([(0,e.wk)()],aJ.prototype,"namespace",void 0),aH([(0,e.wk)()],aJ.prototype,"caipAddress",void 0),aH([(0,e.wk)()],aJ.prototype,"profileName",void 0),aH([(0,e.wk)()],aJ.prototype,"activeConnectorIds",void 0),aH([(0,e.wk)()],aJ.prototype,"selectedExchange",void 0),aJ=aH([(0,n.EM)("w3m-pay-loading-view")],aJ),c(46113),c(89656);let aK=(0,d.AH)`
  :host {
    display: block;
  }
`,aL=class extends d.WF{render(){return(0,d.qy)`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-shimmer width="60px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Network Fee</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-shimmer
              width="75px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>

            <wui-flex alignItems="center" gap="01">
              <wui-shimmer width="14px" height="14px" rounded variant="light"></wui-shimmer>
              <wui-shimmer
                width="49px"
                height="14px"
                borderRadius="4xs"
                variant="light"
              ></wui-shimmer>
            </wui-flex>
          </wui-flex>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Service Fee</wui-text>
          <wui-shimmer width="75px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>
      </wui-flex>
    `}};aL.styles=[aK],aL=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g}([(0,n.EM)("w3m-pay-fees-skeleton")],aL);let aM=(0,n.AH)`
  :host {
    display: block;
  }

  wui-image {
    border-radius: ${({borderRadius:a})=>a.round};
  }
`;var aN=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let aO=class extends d.WF{constructor(){super(),this.unsubscribe=[],this.quote=as.state.quote,this.unsubscribe.push(as.subscribeKey("quote",a=>this.quote=a))}disconnectedCallback(){this.unsubscribe.forEach(a=>a())}render(){let a=s.S.formatNumber(this.quote?.origin.amount||"0",{decimals:this.quote?.origin.currency.metadata.decimals??0,round:6}).toString();return(0,d.qy)`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-text variant="md-regular" color="primary">
            ${a} ${this.quote?.origin.currency.metadata.symbol||"Unknown"}
          </wui-text>
        </wui-flex>

        ${this.quote&&this.quote.fees.length>0?this.quote.fees.map(a=>this.renderFee(a)):null}
      </wui-flex>
    `}renderFee(a){let b="network"===a.id,c=s.S.formatNumber(a.amount||"0",{decimals:a.currency.metadata.decimals??0,round:6}).toString();if(b){let b=h.W.getAllRequestedCaipNetworks().find(b=>w.y.isLowerCaseMatch(b.caipNetworkId,a.currency.network));return(0,d.qy)`
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">${a.label}</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-text variant="md-regular" color="primary">
              ${c} ${a.currency.metadata.symbol||"Unknown"}
            </wui-text>

            <wui-flex alignItems="center" gap="01">
              <wui-image
                src=${(0,f.J)(i.$.getNetworkImage(b))}
                size="xs"
              ></wui-image>
              <wui-text variant="sm-regular" color="secondary">
                ${b?.name||"Unknown"}
              </wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      `}return(0,d.qy)`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-text variant="md-regular" color="secondary">${a.label}</wui-text>
        <wui-text variant="md-regular" color="primary">
          ${c} ${a.currency.metadata.symbol||"Unknown"}
        </wui-text>
      </wui-flex>
    `}};aO.styles=[aM],aN([(0,e.wk)()],aO.prototype,"quote",void 0),aO=aN([(0,n.EM)("w3m-pay-fees")],aO);let aP=(0,n.AH)`
  :host {
    display: block;
    width: 100%;
  }

  .disabled-container {
    padding: ${({spacing:a})=>a[2]};
    min-height: 168px;
  }

  wui-icon {
    width: ${({spacing:a})=>a[8]};
    height: ${({spacing:a})=>a[8]};
  }

  wui-flex > wui-text {
    max-width: 273px;
  }
`;var aQ=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let aR=class extends d.WF{constructor(){super(),this.unsubscribe=[],this.selectedExchange=as.state.selectedExchange,this.unsubscribe.push(as.subscribeKey("selectedExchange",a=>this.selectedExchange=a))}disconnectedCallback(){this.unsubscribe.forEach(a=>a())}render(){let a=!!this.selectedExchange;return(0,d.qy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
        class="disabled-container"
      >
        <wui-icon name="coins" color="default" size="inherit"></wui-icon>

        <wui-text variant="md-regular" color="primary" align="center">
          You don't have enough funds to complete this transaction
        </wui-text>

        ${a?null:(0,d.qy)`<wui-button
              size="md"
              variant="neutral-secondary"
              @click=${this.dispatchConnectOtherWalletEvent.bind(this)}
              >Connect other wallet</wui-button
            >`}
      </wui-flex>
    `}dispatchConnectOtherWalletEvent(){this.dispatchEvent(new CustomEvent("connectOtherWallet",{detail:!0,bubbles:!0,composed:!0}))}};aR.styles=[aP],aQ([(0,e.MZ)({type:Array})],aR.prototype,"selectedExchange",void 0),aR=aQ([(0,n.EM)("w3m-pay-options-empty")],aR);let aS=(0,n.AH)`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    border-radius: ${({borderRadius:a})=>a[4]};
    padding: ${({spacing:a})=>a[3]};
    min-height: 60px;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .chain-image {
    position: absolute;
    bottom: -3px;
    right: -5px;
    border: 2px solid ${({tokens:a})=>a.theme.foregroundSecondary};
  }
`,aT=class extends d.WF{render(){return(0,d.qy)`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.renderOptionEntry()} ${this.renderOptionEntry()} ${this.renderOptionEntry()}
      </wui-flex>
    `}renderOptionEntry(){return(0,d.qy)`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-shimmer
              width="32px"
              height="32px"
              rounded
              variant="light"
              class="token-image"
            ></wui-shimmer>
            <wui-shimmer
              width="16px"
              height="16px"
              rounded
              variant="light"
              class="chain-image"
            ></wui-shimmer>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-shimmer
              width="74px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
            <wui-shimmer
              width="46px"
              height="14px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}};aT.styles=[aS],aT=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g}([(0,n.EM)("w3m-pay-options-skeleton")],aT);let aU=(0,n.AH)`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    mask-image: var(--options-mask-image);
    -webkit-mask-image: var(--options-mask-image);
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    cursor: pointer;
    border-radius: ${({borderRadius:a})=>a[4]};
    padding: ${({spacing:a})=>a[3]};
    transition: background-color ${({durations:a})=>a.lg}
      ${({easings:a})=>a["ease-out-power-1"]};
    will-change: background-color;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:a})=>a.round};
    width: 32px;
    height: 32px;
  }

  .chain-image {
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:a})=>a.round};
    border: 2px solid ${({tokens:a})=>a.theme.backgroundPrimary};
  }

  @media (hover: hover) and (pointer: fine) {
    .pay-option-container:hover {
      background-color: ${({tokens:a})=>a.theme.foregroundPrimary};
    }
  }
`;var aV=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let aW=class extends d.WF{constructor(){super(),this.unsubscribe=[],this.options=[],this.selectedPaymentAsset=null}disconnectedCallback(){this.unsubscribe.forEach(a=>a()),this.resizeObserver?.disconnect();let a=this.shadowRoot?.querySelector(".pay-options-container");a?.removeEventListener("scroll",this.handleOptionsListScroll.bind(this))}firstUpdated(){let a=this.shadowRoot?.querySelector(".pay-options-container");a&&(requestAnimationFrame(this.handleOptionsListScroll.bind(this)),a?.addEventListener("scroll",this.handleOptionsListScroll.bind(this)),this.resizeObserver=new ResizeObserver(()=>{this.handleOptionsListScroll()}),this.resizeObserver?.observe(a),this.handleOptionsListScroll())}render(){return(0,d.qy)`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.options.map(a=>this.payOptionTemplate(a))}
      </wui-flex>
    `}payOptionTemplate(a){let{network:b,metadata:c,asset:e,amount:g="0"}=a,j=h.W.getAllRequestedCaipNetworks().find(a=>a.caipNetworkId===b),k=`${b}:${e}`,l=`${this.selectedPaymentAsset?.network}:${this.selectedPaymentAsset?.asset}`,m=s.S.bigNumber(g,{safe:!0}),n=m.gt(0);return(0,d.qy)`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        @click=${()=>this.onSelect?.(a)}
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-image
              src=${(0,f.J)(c.logoURI)}
              class="token-image"
              size="3xl"
            ></wui-image>
            <wui-image
              src=${(0,f.J)(i.$.getNetworkImage(j))}
              class="chain-image"
              size="md"
            ></wui-image>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="lg-regular" color="primary">${c.symbol}</wui-text>
            ${n?(0,d.qy)`<wui-text variant="sm-regular" color="secondary">
                  ${m.round(6).toString()} ${c.symbol}
                </wui-text>`:null}
          </wui-flex>
        </wui-flex>

        ${k===l?(0,d.qy)`<wui-icon name="checkmark" size="md" color="success"></wui-icon>`:null}
      </wui-flex>
    `}handleOptionsListScroll(){let a=this.shadowRoot?.querySelector(".pay-options-container");a&&(a.scrollHeight>300?(a.style.setProperty("--options-mask-image",`linear-gradient(
          to bottom,
          rgba(0, 0, 0, calc(1 - var(--options-scroll--top-opacity))) 0px,
          rgba(200, 200, 200, calc(1 - var(--options-scroll--top-opacity))) 1px,
          black 50px,
          black calc(100% - 50px),
          rgba(155, 155, 155, calc(1 - var(--options-scroll--bottom-opacity))) calc(100% - 1px),
          rgba(0, 0, 0, calc(1 - var(--options-scroll--bottom-opacity))) 100%
        )`),a.style.setProperty("--options-scroll--top-opacity",n.z8.interpolate([0,50],[0,1],a.scrollTop).toString()),a.style.setProperty("--options-scroll--bottom-opacity",n.z8.interpolate([0,50],[0,1],a.scrollHeight-a.scrollTop-a.offsetHeight).toString())):(a.style.setProperty("--options-mask-image","none"),a.style.setProperty("--options-scroll--top-opacity","0"),a.style.setProperty("--options-scroll--bottom-opacity","0")))}};aW.styles=[aU],aV([(0,e.MZ)({type:Array})],aW.prototype,"options",void 0),aV([(0,e.MZ)()],aW.prototype,"selectedPaymentAsset",void 0),aV([(0,e.MZ)()],aW.prototype,"onSelect",void 0),aW=aV([(0,n.EM)("w3m-pay-options")],aW);let aX=(0,n.AH)`
  .payment-methods-container {
    background-color: ${({tokens:a})=>a.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:a})=>a[5]};
    border-top-left-radius: ${({borderRadius:a})=>a[5]};
  }

  .pay-options-container {
    background-color: ${({tokens:a})=>a.theme.foregroundSecondary};
    border-radius: ${({borderRadius:a})=>a[5]};
    padding: ${({spacing:a})=>a[1]};
  }

  w3m-tooltip-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: fit-content;
  }

  wui-image {
    border-radius: ${({borderRadius:a})=>a.round};
  }

  w3m-pay-options.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;var aY=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let aZ={eip155:{icon:"ethereum",label:"EVM"},solana:{icon:"solana",label:"Solana"},bip122:{icon:"bitcoin",label:"Bitcoin"},ton:{icon:"ton",label:"Ton"}},a$=class extends d.WF{constructor(){super(),this.unsubscribe=[],this.profileName=null,this.paymentAsset=as.state.paymentAsset,this.namespace=void 0,this.caipAddress=void 0,this.amount=as.state.amount,this.recipient=as.state.recipient,this.activeConnectorIds=g.a.state.activeConnectorIds,this.selectedPaymentAsset=as.state.selectedPaymentAsset,this.selectedExchange=as.state.selectedExchange,this.isFetchingQuote=as.state.isFetchingQuote,this.quoteError=as.state.quoteError,this.quote=as.state.quote,this.isFetchingTokenBalances=as.state.isFetchingTokenBalances,this.tokenBalances=as.state.tokenBalances,this.isPaymentInProgress=as.state.isPaymentInProgress,this.exchangeUrlForQuote=as.state.exchangeUrlForQuote,this.completedTransactionsCount=0,this.unsubscribe.push(as.subscribeKey("paymentAsset",a=>this.paymentAsset=a)),this.unsubscribe.push(as.subscribeKey("tokenBalances",a=>this.onTokenBalancesChanged(a))),this.unsubscribe.push(as.subscribeKey("isFetchingTokenBalances",a=>this.isFetchingTokenBalances=a)),this.unsubscribe.push(g.a.subscribeKey("activeConnectorIds",a=>this.activeConnectorIds=a)),this.unsubscribe.push(as.subscribeKey("selectedPaymentAsset",a=>this.selectedPaymentAsset=a)),this.unsubscribe.push(as.subscribeKey("isFetchingQuote",a=>this.isFetchingQuote=a)),this.unsubscribe.push(as.subscribeKey("quoteError",a=>this.quoteError=a)),this.unsubscribe.push(as.subscribeKey("quote",a=>this.quote=a)),this.unsubscribe.push(as.subscribeKey("amount",a=>this.amount=a)),this.unsubscribe.push(as.subscribeKey("recipient",a=>this.recipient=a)),this.unsubscribe.push(as.subscribeKey("isPaymentInProgress",a=>this.isPaymentInProgress=a)),this.unsubscribe.push(as.subscribeKey("selectedExchange",a=>this.selectedExchange=a)),this.unsubscribe.push(as.subscribeKey("exchangeUrlForQuote",a=>this.exchangeUrlForQuote=a)),this.resetQuoteState(),this.initializeNamespace(),this.fetchTokens()}disconnectedCallback(){super.disconnectedCallback(),this.resetAssetsState(),this.unsubscribe.forEach(a=>a())}updated(a){super.updated(a),a.has("selectedPaymentAsset")&&this.fetchQuote()}render(){return(0,d.qy)`
      <wui-flex flexDirection="column">
        ${this.profileTemplate()}

        <wui-flex
          flexDirection="column"
          gap="4"
          class="payment-methods-container"
          .padding=${["4","4","5","4"]}
        >
          ${this.paymentOptionsViewTemplate()} ${this.amountWithFeeTemplate()}

          <wui-flex
            alignItems="center"
            justifyContent="space-between"
            .padding=${["1","0","1","0"]}
          >
            <wui-separator></wui-separator>
          </wui-flex>

          ${this.paymentActionsTemplate()}
        </wui-flex>
      </wui-flex>
    `}profileTemplate(){if(this.selectedExchange){let a=s.S.formatNumber(this.quote?.origin.amount,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return(0,d.qy)`
        <wui-flex
          .padding=${["4","3","4","3"]}
          alignItems="center"
          justifyContent="space-between"
          gap="2"
        >
          <wui-text variant="lg-regular" color="secondary">Paying with</wui-text>

          ${this.quote?(0,d.qy)`<wui-text variant="lg-regular" color="primary">
                ${s.S.bigNumber(a,{safe:!0}).round(6).toString()}
                ${this.quote.origin.currency.metadata.symbol}
              </wui-text>`:(0,d.qy)`<wui-shimmer width="80px" height="18px" variant="light"></wui-shimmer>`}
        </wui-flex>
      `}let a=u.w.getPlainAddress(this.caipAddress)??"",{name:b,image:c}=this.getWalletProperties({namespace:this.namespace}),{icon:e,label:g}=aZ[this.namespace]??{};return(0,d.qy)`
      <wui-flex
        .padding=${["4","3","4","3"]}
        alignItems="center"
        justifyContent="space-between"
        gap="2"
      >
        <wui-wallet-switch
          profileName=${(0,f.J)(this.profileName)}
          address=${(0,f.J)(a)}
          imageSrc=${(0,f.J)(c)}
          alt=${(0,f.J)(b)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        <wui-wallet-switch
          profileName=${(0,f.J)(g)}
          address=${(0,f.J)(a)}
          icon=${(0,f.J)(e)}
          iconSize="xs"
          .enableGreenCircle=${!1}
          alt=${(0,f.J)(g)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
      </wui-flex>
    `}initializeNamespace(){let a=h.W.state.activeChain;this.namespace=a,this.caipAddress=h.W.getAccountData(a)?.caipAddress,this.profileName=h.W.getAccountData(a)?.profileName??null,this.unsubscribe.push(h.W.subscribeChainProp("accountState",a=>this.onAccountStateChanged(a),a))}async fetchTokens(){if(this.namespace){let a;if(this.caipAddress){let{chainId:b,chainNamespace:c}=r.C.parseCaipAddress(this.caipAddress),d=`${c}:${b}`;a=h.W.getAllRequestedCaipNetworks().find(a=>a.caipNetworkId===d)}await as.fetchTokens({caipAddress:this.caipAddress,caipNetwork:a,namespace:this.namespace})}}fetchQuote(){if(this.amount&&this.recipient&&this.selectedPaymentAsset&&this.paymentAsset){let{address:a}=this.caipAddress?r.C.parseCaipAddress(this.caipAddress):{};as.fetchQuote({amount:this.amount.toString(),address:a,sourceToken:this.selectedPaymentAsset,toToken:this.paymentAsset,recipient:this.recipient})}}getWalletProperties({namespace:a}){if(!a)return{name:void 0,image:void 0};let b=this.activeConnectorIds[a];if(!b)return{name:void 0,image:void 0};let c=g.a.getConnector({id:b,namespace:a});if(!c)return{name:void 0,image:void 0};let d=i.$.getConnectorImage(c);return{name:c.name,image:d}}paymentOptionsViewTemplate(){return(0,d.qy)`
      <wui-flex flexDirection="column" gap="2">
        <wui-text variant="sm-regular" color="secondary">CHOOSE PAYMENT OPTION</wui-text>
        <wui-flex class="pay-options-container">${this.paymentOptionsTemplate()}</wui-flex>
      </wui-flex>
    `}paymentOptionsTemplate(){let a=this.getPaymentAssetFromTokenBalances();if(this.isFetchingTokenBalances)return(0,d.qy)`<w3m-pay-options-skeleton></w3m-pay-options-skeleton>`;if(0===a.length)return(0,d.qy)`<w3m-pay-options-empty
        @connectOtherWallet=${this.onConnectOtherWallet.bind(this)}
      ></w3m-pay-options-empty>`;let b={disabled:this.isFetchingQuote};return(0,d.qy)`<w3m-pay-options
      class=${(0,aw.H)(b)}
      .options=${a}
      .selectedPaymentAsset=${(0,f.J)(this.selectedPaymentAsset)}
      .onSelect=${this.onSelectedPaymentAssetChanged.bind(this)}
    ></w3m-pay-options>`}amountWithFeeTemplate(){return this.isFetchingQuote||!this.selectedPaymentAsset||this.quoteError?(0,d.qy)`<w3m-pay-fees-skeleton></w3m-pay-fees-skeleton>`:(0,d.qy)`<w3m-pay-fees></w3m-pay-fees>`}paymentActionsTemplate(){let a=this.isFetchingQuote||this.isFetchingTokenBalances,b=this.isFetchingQuote||this.isFetchingTokenBalances||!this.selectedPaymentAsset||!!this.quoteError,c=s.S.formatNumber(this.quote?.origin.amount??0,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return this.selectedExchange?a||b?(0,d.qy)`
          <wui-shimmer width="100%" height="48px" variant="light" ?rounded=${!0}></wui-shimmer>
        `:(0,d.qy)`<wui-button
        size="lg"
        fullWidth
        variant="accent-secondary"
        @click=${this.onPayWithExchange.bind(this)}
      >
        ${`Continue in ${this.selectedExchange.name}`}

        <wui-icon name="arrowRight" color="inherit" size="sm" slot="iconRight"></wui-icon>
      </wui-button>`:(0,d.qy)`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-flex flexDirection="column" gap="1">
          <wui-text variant="md-regular" color="secondary">Order Total</wui-text>

          ${a||b?(0,d.qy)`<wui-shimmer width="58px" height="32px" variant="light"></wui-shimmer>`:(0,d.qy)`<wui-flex alignItems="center" gap="01">
                <wui-text variant="h4-regular" color="primary">${am(c)}</wui-text>

                <wui-text variant="lg-regular" color="secondary">
                  ${this.quote?.origin.currency.metadata.symbol||"Unknown"}
                </wui-text>
              </wui-flex>`}
        </wui-flex>

        ${this.actionButtonTemplate({isLoading:a,isDisabled:b})}
      </wui-flex>
    `}actionButtonTemplate(a){let b=Y(this.quote),{isLoading:c,isDisabled:e}=a,f="Pay";return b.length>1&&0===this.completedTransactionsCount&&(f="Approve"),(0,d.qy)`
      <wui-button
        size="lg"
        variant="accent-primary"
        ?loading=${c||this.isPaymentInProgress}
        ?disabled=${e||this.isPaymentInProgress}
        @click=${()=>{b.length>0?this.onSendTransactions():this.onTransfer()}}
      >
        ${f}
        ${c?null:(0,d.qy)`<wui-icon
              name="arrowRight"
              color="inherit"
              size="sm"
              slot="iconRight"
            ></wui-icon>`}
      </wui-button>
    `}getPaymentAssetFromTokenBalances(){return this.namespace?(this.tokenBalances[this.namespace]??[]).map(a=>{try{return function(a){let b=h.W.getAllRequestedCaipNetworks().find(b=>b.caipNetworkId===a.chainId),c=a.address;if(!b)throw Error(`Target network not found for balance chainId "${a.chainId}"`);if(w.y.isLowerCaseMatch(a.symbol,b.nativeCurrency.symbol))c="native";else if(u.w.isCaipAddress(c)){let{address:a}=r.C.parseCaipAddress(c);c=a}else if(!c)throw Error(`Balance address not found for balance symbol "${a.symbol}"`);return{network:b.caipNetworkId,asset:c,metadata:{name:a.name,symbol:a.symbol,decimals:Number(a.quantity.decimals),logoURI:a.iconUrl},amount:a.quantity.numeric}}(a)}catch(a){return null}}).filter(a=>!!a).filter(a=>{let{chainId:b}=r.C.parseCaipNetworkId(a.network),{chainId:c}=r.C.parseCaipNetworkId(this.paymentAsset.network);return!!w.y.isLowerCaseMatch(a.asset,this.paymentAsset.asset)||!this.selectedExchange||!w.y.isLowerCaseMatch(b.toString(),c.toString())}):[]}onTokenBalancesChanged(a){this.tokenBalances=a;let[b]=this.getPaymentAssetFromTokenBalances();b&&as.setSelectedPaymentAsset(b)}async onConnectOtherWallet(){await g.a.connect(),await k.W.open({view:"PayQuote"})}onAccountStateChanged(a){let{address:b}=this.caipAddress?r.C.parseCaipAddress(this.caipAddress):{};if(this.caipAddress=a?.caipAddress,this.profileName=a?.profileName??null,b){let{address:a}=this.caipAddress?r.C.parseCaipAddress(this.caipAddress):{};a?w.y.isLowerCaseMatch(a,b)||(this.resetAssetsState(),this.resetQuoteState(),this.fetchTokens()):k.W.close()}}onSelectedPaymentAssetChanged(a){this.isFetchingQuote||as.setSelectedPaymentAsset(a)}async onTransfer(){let a=X(this.quote);if(a){if(!w.y.isLowerCaseMatch(this.selectedPaymentAsset?.asset,a.deposit.currency))throw Error("Quote asset is not the same as the selected payment asset");let b=this.selectedPaymentAsset?.amount??"0",c=s.S.formatNumber(a.deposit.amount,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!s.S.bigNumber(b).gte(c))return void m.P.showError("Insufficient funds");if(this.quote&&this.selectedPaymentAsset&&this.caipAddress&&this.namespace){let{address:b}=r.C.parseCaipAddress(this.caipAddress);await as.onTransfer({chainNamespace:this.namespace,fromAddress:b,toAddress:a.deposit.receiver,amount:c,paymentAsset:this.selectedPaymentAsset}),as.setRequestId(a.requestId),j.I.push("PayLoading")}}}async onSendTransactions(){let a=this.selectedPaymentAsset?.amount??"0",b=s.S.formatNumber(this.quote?.origin.amount??0,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!s.S.bigNumber(a).gte(b))return void m.P.showError("Insufficient funds");let c=Y(this.quote),[d]=Y(this.quote,this.completedTransactionsCount);d&&this.namespace&&(await as.onSendTransaction({namespace:this.namespace,transactionStep:d}),this.completedTransactionsCount+=1,this.completedTransactionsCount===c.length&&(as.setRequestId(d.requestId),j.I.push("PayLoading")))}onPayWithExchange(){if(this.exchangeUrlForQuote){let a=u.w.returnOpenHref("","popupWindow","scrollbar=yes,width=480,height=720");if(!a)throw Error("Could not create popup window");a.location.href=this.exchangeUrlForQuote;let b=X(this.quote);b&&as.setRequestId(b.requestId),as.initiatePayment(),j.I.push("PayLoading")}}resetAssetsState(){as.setSelectedPaymentAsset(null)}resetQuoteState(){as.resetQuoteState()}};async function a_(a){return as.handleOpenPay(a)}async function a0(a,b=3e5){if(b<=0)throw new M(x,"Timeout must be greater than 0");try{await a_(a)}catch(a){if(a instanceof M)throw a;throw new M(B,a.message)}return new Promise((a,c)=>{var d;let e=!1,f=setTimeout(()=>{e||(e=!0,h(),c(new M(D,"Payment timeout")))},b);function g(){if(e)return;let b=as.state.currentPayment,c=as.state.error,d=as.state.isPaymentInProgress;if(b?.status==="SUCCESS"){e=!0,h(),clearTimeout(f),a({success:!0,result:b.result});return}if(b?.status==="FAILED"){e=!0,h(),clearTimeout(f),a({success:!1,error:c||"Payment failed"});return}!c||d||b||(e=!0,h(),clearTimeout(f),a({success:!1,error:c}))}let h=(d=[a5("currentPayment",g),a5("error",g),a5("isPaymentInProgress",g)],()=>{d.forEach(a=>{try{a()}catch{}})});g()})}function a1(){return as.getExchanges()}function a2(){return as.state.currentPayment?.result}function a3(){return as.state.error}function a4(){return as.state.isPaymentInProgress}function a5(a,b){return as.subscribeKey(a,b)}a$.styles=aX,aY([(0,e.wk)()],a$.prototype,"profileName",void 0),aY([(0,e.wk)()],a$.prototype,"paymentAsset",void 0),aY([(0,e.wk)()],a$.prototype,"namespace",void 0),aY([(0,e.wk)()],a$.prototype,"caipAddress",void 0),aY([(0,e.wk)()],a$.prototype,"amount",void 0),aY([(0,e.wk)()],a$.prototype,"recipient",void 0),aY([(0,e.wk)()],a$.prototype,"activeConnectorIds",void 0),aY([(0,e.wk)()],a$.prototype,"selectedPaymentAsset",void 0),aY([(0,e.wk)()],a$.prototype,"selectedExchange",void 0),aY([(0,e.wk)()],a$.prototype,"isFetchingQuote",void 0),aY([(0,e.wk)()],a$.prototype,"quoteError",void 0),aY([(0,e.wk)()],a$.prototype,"quote",void 0),aY([(0,e.wk)()],a$.prototype,"isFetchingTokenBalances",void 0),aY([(0,e.wk)()],a$.prototype,"tokenBalances",void 0),aY([(0,e.wk)()],a$.prototype,"isPaymentInProgress",void 0),aY([(0,e.wk)()],a$.prototype,"exchangeUrlForQuote",void 0),aY([(0,e.wk)()],a$.prototype,"completedTransactionsCount",void 0),a$=aY([(0,n.EM)("w3m-pay-quote-view")],a$);let a6={network:"eip155:8453",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},a7={network:"eip155:8453",asset:"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},a8={network:"eip155:84532",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},a9={network:"eip155:1",asset:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},ba={network:"eip155:10",asset:"0x0b2c639c533813f4aa9d7837caf62653d097ff85",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},bb={network:"eip155:42161",asset:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},bc={network:"eip155:137",asset:"0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},bd={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},be={network:"eip155:1",asset:"0xdAC17F958D2ee523a2206206994597C13D831ec7",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},bf={network:"eip155:10",asset:"0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},bg={network:"eip155:42161",asset:"0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},bh={network:"eip155:137",asset:"0xc2132d05d31c914a87c6611c10748aeb04b58e8f",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},bi={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},bj={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"native",metadata:{name:"Solana",symbol:"SOL",decimals:9}}}};