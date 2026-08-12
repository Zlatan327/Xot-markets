"use strict";exports.id=1678,exports.ids=[1678],exports.modules={9850:(a,b,c)=>{var d=c(53478),e=c(96313);c(41686),c(87922),c(28224),c(35012),c(41074);var f=c(58003),g=c(33440),h=c(38051);let i=(0,h.AH)`
  button {
    display: block;
    display: flex;
    align-items: center;
    padding: ${({spacing:a})=>a[1]};
    transition: background-color ${({durations:a})=>a.lg}
      ${({easings:a})=>a["ease-out-power-2"]};
    will-change: background-color;
    background-color: ${({tokens:a})=>a.theme.foregroundPrimary};
    border-radius: ${({borderRadius:a})=>a[32]};
  }

  wui-image {
    border-radius: ${({borderRadius:a})=>a[32]};
  }

  wui-text {
    padding-left: ${({spacing:a})=>a[1]};
    padding-right: ${({spacing:a})=>a[1]};
  }

  .left-icon-container {
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
  }

  .left-image-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .chain-image {
    position: absolute;
    border: 1px solid ${({tokens:a})=>a.theme.foregroundPrimary};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='lg'] {
    height: 32px;
  }

  button[data-size='md'] {
    height: 28px;
  }

  button[data-size='sm'] {
    height: 24px;
  }

  button[data-size='lg'] .token-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] .token-image {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] .token-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] .left-icon-container {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] .left-icon-container {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] .left-icon-container {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] .chain-image {
    width: 12px;
    height: 12px;
    bottom: 2px;
    right: -4px;
  }

  button[data-size='md'] .chain-image {
    width: 10px;
    height: 10px;
    bottom: 2px;
    right: -4px;
  }

  button[data-size='sm'] .chain-image {
    width: 8px;
    height: 8px;
    bottom: 2px;
    right: -3px;
  }

  /* -- Focus states --------------------------------------------------- */
  button:focus-visible:enabled {
    background-color: ${({tokens:a})=>a.theme.foregroundSecondary};
    box-shadow: 0 0 0 4px ${({tokens:a})=>a.core.foregroundAccent040};
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) {
    button:hover:enabled,
    button:active:enabled {
      background-color: ${({tokens:a})=>a.theme.foregroundSecondary};
    }
  }

  /* -- Disabled states --------------------------------------------------- */
  button:disabled {
    background-color: ${({tokens:a})=>a.theme.foregroundSecondary};
    opacity: 0.5;
  }
`;var j=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let k={lg:"lg-regular",md:"lg-regular",sm:"md-regular"},l={lg:"lg",md:"md",sm:"sm"},m=class extends d.WF{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.text="",this.loading=!1}render(){return this.loading?(0,d.qy)` <wui-flex alignItems="center" gap="01" padding="01">
        <wui-shimmer width="20px" height="20px"></wui-shimmer>
        <wui-shimmer width="32px" height="18px" borderRadius="4xs"></wui-shimmer>
      </wui-flex>`:(0,d.qy)`
      <button ?disabled=${this.disabled} data-size=${this.size}>
        ${this.imageTemplate()} ${this.textTemplate()}
      </button>
    `}imageTemplate(){if(this.imageSrc&&this.chainImageSrc)return(0,d.qy)`<wui-flex class="left-image-container">
        <wui-image src=${this.imageSrc} class="token-image"></wui-image>
        <wui-image src=${this.chainImageSrc} class="chain-image"></wui-image>
      </wui-flex>`;if(this.imageSrc)return(0,d.qy)`<wui-image src=${this.imageSrc} class="token-image"></wui-image>`;let a=l[this.size];return(0,d.qy)`<wui-flex class="left-icon-container">
      <wui-icon size=${a} name="networkPlaceholder"></wui-icon>
    </wui-flex>`}textTemplate(){let a=k[this.size];return(0,d.qy)`<wui-text color="primary" variant=${a}
      >${this.text}</wui-text
    >`}};m.styles=[f.W5,f.fD,i],j([(0,e.MZ)()],m.prototype,"size",void 0),j([(0,e.MZ)()],m.prototype,"imageSrc",void 0),j([(0,e.MZ)()],m.prototype,"chainImageSrc",void 0),j([(0,e.MZ)({type:Boolean})],m.prototype,"disabled",void 0),j([(0,e.MZ)()],m.prototype,"text",void 0),j([(0,e.MZ)({type:Boolean})],m.prototype,"loading",void 0),m=j([(0,g.E)("wui-token-button")],m)},31462:(a,b,c)=>{var d=c(53478),e=c(96313),f=c(19533),g=c(38051),h=c(58003),i=c(46690),j=c(33440);let k=(0,g.AH)`
  :host {
    position: relative;
    display: inline-block;
  }

  :host([data-error='true']) > input {
    color: ${({tokens:a})=>a.core.textError};
  }

  :host([data-error='false']) > input {
    color: ${({tokens:a})=>a.theme.textPrimary};
  }

  input {
    background: transparent;
    height: auto;
    box-sizing: border-box;
    color: ${({tokens:a})=>a.theme.textPrimary};
    font-feature-settings: 'case' on;
    font-size: ${({textSize:a})=>a.h4};
    caret-color: ${({tokens:a})=>a.core.backgroundAccentPrimary};
    line-height: ${({typography:a})=>a["h4-regular-mono"].lineHeight};
    letter-spacing: ${({typography:a})=>a["h4-regular-mono"].letterSpacing};
    -webkit-appearance: none;
    -moz-appearance: textfield;
    padding: 0px;
    font-family: ${({fontFamily:a})=>a.mono};
  }

  :host([data-width-variant='auto']) input {
    width: 100%;
  }

  :host([data-width-variant='fit']) input {
    width: 1ch;
  }

  .wui-input-amount-fit-mirror {
    position: absolute;
    visibility: hidden;
    white-space: pre;
    font-size: var(--local-font-size);
    line-height: 130%;
    letter-spacing: -1.28px;
    font-family: ${({fontFamily:a})=>a.mono};
  }

  .wui-input-amount-fit-width {
    display: inline-block;
    position: relative;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input::placeholder {
    color: ${({tokens:a})=>a.theme.textSecondary};
  }
`;var l=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let m=class extends d.WF{constructor(){super(...arguments),this.inputElementRef=(0,f._)(),this.disabled=!1,this.value="",this.placeholder="0",this.widthVariant="auto",this.maxDecimals=void 0,this.maxIntegers=void 0,this.fontSize="h4",this.error=!1}firstUpdated(){this.resizeInput()}updated(){this.style.setProperty("--local-font-size",g.f.textSize[this.fontSize]),this.resizeInput()}render(){return(this.dataset.widthVariant=this.widthVariant,this.dataset.error=String(this.error),this.inputElementRef?.value&&this.value&&(this.inputElementRef.value.value=this.value),"auto"===this.widthVariant)?this.inputTemplate():(0,d.qy)`
      <div class="wui-input-amount-fit-width">
        <span class="wui-input-amount-fit-mirror"></span>
        ${this.inputTemplate()}
      </div>
    `}inputTemplate(){return(0,d.qy)`<input
      ${(0,f.K)(this.inputElementRef)}
      type="text"
      inputmode="decimal"
      pattern="[0-9,.]*"
      placeholder=${this.placeholder}
      ?disabled=${this.disabled}
      autofocus
      value=${this.value??""}
      @input=${this.dispatchInputChangeEvent.bind(this)}
    />`}dispatchInputChangeEvent(){this.inputElementRef.value&&(this.inputElementRef.value.value=i.Z.maskInput({value:this.inputElementRef.value.value,decimals:this.maxDecimals,integers:this.maxIntegers}),this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value.value,bubbles:!0,composed:!0})),this.resizeInput())}resizeInput(){if("fit"===this.widthVariant){let a=this.inputElementRef.value;if(a){let b=a.previousElementSibling;b&&(b.textContent=a.value||"0",a.style.width=`${b.offsetWidth}px`)}}}};m.styles=[h.W5,h.fD,k],l([(0,e.MZ)({type:Boolean})],m.prototype,"disabled",void 0),l([(0,e.MZ)({type:String})],m.prototype,"value",void 0),l([(0,e.MZ)({type:String})],m.prototype,"placeholder",void 0),l([(0,e.MZ)({type:String})],m.prototype,"widthVariant",void 0),l([(0,e.MZ)({type:Number})],m.prototype,"maxDecimals",void 0),l([(0,e.MZ)({type:Number})],m.prototype,"maxIntegers",void 0),l([(0,e.MZ)({type:String})],m.prototype,"fontSize",void 0),l([(0,e.MZ)({type:Boolean})],m.prototype,"error",void 0),m=l([(0,j.E)("wui-input-amount")],m)},91678:(a,b,c)=>{c.r(b),c.d(b,{W3mSendConfirmedView:()=>_,W3mSendSelectTokenView:()=>G,W3mWalletSendPreviewView:()=>Z,W3mWalletSendView:()=>D});var d=c(53478),e=c(96313),f=c(57508),g=c(18813),h=c(62970),i=c(37662),j=c(47618),k=c(40702),l=c(66407),m=c(63860),n=c(99257),o=c(72742),p=c(78743),q=c(21925),r=c(96214);c(85087),c(64436),c(76922),c(8547);var s=c(19533);c(52958),c(82268);let t=(0,r.AH)`
  :host {
    width: 100%;
    height: 100px;
    border-radius: ${({borderRadius:a})=>a["5"]};
    border: 1px solid ${({tokens:a})=>a.theme.foregroundPrimary};
    background-color: ${({tokens:a})=>a.theme.foregroundPrimary};
    transition: background-color ${({durations:a})=>a.lg}
      ${({easings:a})=>a["ease-out-power-1"]};
    will-change: background-color;
    position: relative;
  }

  :host(:hover) {
    background-color: ${({tokens:a})=>a.theme.foregroundSecondary};
  }

  wui-flex {
    width: 100%;
    height: fit-content;
  }

  wui-button {
    display: ruby;
    color: ${({tokens:a})=>a.theme.textPrimary};
    margin: 0 ${({spacing:a})=>a["2"]};
  }

  .instruction {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }

  .paste {
    display: inline-flex;
  }

  textarea {
    background: transparent;
    width: 100%;
    font-family: ${({fontFamily:a})=>a.regular};
    font-style: normal;
    font-size: ${({textSize:a})=>a.large};
    font-weight: ${({fontWeight:a})=>a.regular};
    line-height: ${({typography:a})=>a["lg-regular"].lineHeight};
    letter-spacing: ${({typography:a})=>a["lg-regular"].letterSpacing};
    color: ${({tokens:a})=>a.theme.textPrimary};
    caret-color: ${({tokens:a})=>a.core.backgroundAccentPrimary};
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    padding: 0px;
    border: none;
    outline: none;
    appearance: none;
    resize: none;
    overflow: hidden;
  }
`;var u=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let v=class extends d.WF{constructor(){super(...arguments),this.inputElementRef=(0,s._)(),this.instructionElementRef=(0,s._)(),this.readOnly=!1,this.instructionHidden=!!this.value,this.pasting=!1,this.onDebouncedSearch=m.w.debounce(async a=>{if(!a.length)return void this.setReceiverAddress("");let b=i.W.state.activeChain;if(m.w.isAddress(a,b))return void this.setReceiverAddress(a);try{let b=await l.x.getEnsAddress(a);if(b){g.R.setReceiverProfileName(a),g.R.setReceiverAddress(b);let c=await l.x.getEnsAvatar(a);g.R.setReceiverProfileImageUrl(c||void 0)}}catch(b){this.setReceiverAddress(a)}finally{g.R.setLoading(!1)}})}firstUpdated(){this.value&&(this.instructionHidden=!0),this.checkHidden()}render(){return this.readOnly?(0,d.qy)` <wui-flex
        flexDirection="column"
        justifyContent="center"
        gap="01"
        .padding=${["8","4","5","4"]}
      >
        <textarea
          spellcheck="false"
          ?disabled=${!0}
          autocomplete="off"
          .value=${this.value??""}
        ></textarea>
      </wui-flex>`:(0,d.qy)` <wui-flex
      @click=${this.onBoxClick.bind(this)}
      flexDirection="column"
      justifyContent="center"
      gap="01"
      .padding=${["8","4","5","4"]}
    >
      <wui-text
        ${(0,s.K)(this.instructionElementRef)}
        class="instruction"
        color="secondary"
        variant="md-medium"
      >
        Type or
        <wui-button
          class="paste"
          size="md"
          variant="neutral-secondary"
          iconLeft="copy"
          @click=${this.onPasteClick.bind(this)}
        >
          <wui-icon size="sm" color="inherit" slot="iconLeft" name="copy"></wui-icon>
          Paste
        </wui-button>
        address
      </wui-text>
      <textarea
        spellcheck="false"
        ?disabled=${!this.instructionHidden}
        ${(0,s.K)(this.inputElementRef)}
        @input=${this.onInputChange.bind(this)}
        @blur=${this.onBlur.bind(this)}
        .value=${this.value??""}
        autocomplete="off"
      ></textarea>
    </wui-flex>`}async focusInput(){this.instructionElementRef.value&&(this.instructionHidden=!0,await this.toggleInstructionFocus(!1),this.instructionElementRef.value.style.pointerEvents="none",this.inputElementRef.value?.focus(),this.inputElementRef.value&&(this.inputElementRef.value.selectionStart=this.inputElementRef.value.selectionEnd=this.inputElementRef.value.value.length))}async focusInstruction(){this.instructionElementRef.value&&(this.instructionHidden=!1,await this.toggleInstructionFocus(!0),this.instructionElementRef.value.style.pointerEvents="auto",this.inputElementRef.value?.blur())}async toggleInstructionFocus(a){this.instructionElementRef.value&&await this.instructionElementRef.value.animate([{opacity:+!a},{opacity:+!!a}],{duration:100,easing:"ease",fill:"forwards"}).finished}onBoxClick(){this.value||this.instructionHidden||this.focusInput()}onBlur(){this.value||!this.instructionHidden||this.pasting||this.focusInstruction()}checkHidden(){this.instructionHidden&&this.focusInput()}async onPasteClick(){this.pasting=!0;let a=await navigator.clipboard.readText();g.R.setReceiverAddress(a),this.focusInput()}onInputChange(a){let b=a.target;this.pasting=!1,this.value=a.target?.value,b.value&&!this.instructionHidden&&this.focusInput(),g.R.setLoading(!0),this.onDebouncedSearch(b.value)}setReceiverAddress(a){g.R.setReceiverAddress(a),g.R.setReceiverProfileName(void 0),g.R.setReceiverProfileImageUrl(void 0),g.R.setLoading(!1)}};v.styles=t,u([(0,e.MZ)()],v.prototype,"value",void 0),u([(0,e.MZ)({type:Boolean})],v.prototype,"readOnly",void 0),u([(0,e.wk)()],v.prototype,"instructionHidden",void 0),u([(0,e.wk)()],v.prototype,"pasting",void 0),v=u([(0,r.EM)("w3m-input-address")],v),c(31462),c(26838),c(9850);let w=(0,r.AH)`
  :host {
    width: 100%;
    height: 100px;
    border-radius: ${({borderRadius:a})=>a["5"]};
    border: 1px solid ${({tokens:a})=>a.theme.foregroundPrimary};
    background-color: ${({tokens:a})=>a.theme.foregroundPrimary};
    transition: background-color ${({durations:a})=>a.lg}
      ${({easings:a})=>a["ease-out-power-1"]};
    will-change: background-color;
    transition: all ${({easings:a})=>a["ease-out-power-1"]}
      ${({durations:a})=>a.lg};
  }

  :host(:hover) {
    background-color: ${({tokens:a})=>a.theme.foregroundSecondary};
  }

  wui-flex {
    width: 100%;
    height: fit-content;
  }

  wui-button {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  wui-input-amount {
    mask-image: linear-gradient(
      270deg,
      transparent 0px,
      transparent 8px,
      black 24px,
      black 25px,
      black 32px,
      black 100%
    );
  }

  .totalValue {
    width: 100%;
  }
`;var x=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let y=class extends d.WF{constructor(){super(...arguments),this.readOnly=!1,this.isInsufficientBalance=!1}render(){let a=this.readOnly||!this.token;return(0,d.qy)` <wui-flex
      flexDirection="column"
      gap="01"
      .padding=${["5","3","4","3"]}
    >
      <wui-flex alignItems="center">
        <wui-input-amount
          @inputChange=${this.onInputChange.bind(this)}
          ?disabled=${a}
          .value=${this.sendTokenAmount??""}
          ?error=${!!this.isInsufficientBalance}
        ></wui-input-amount>
        ${this.buttonTemplate()}
      </wui-flex>
      ${this.bottomTemplate()}
    </wui-flex>`}buttonTemplate(){return this.token?(0,d.qy)`<wui-token-button
        text=${this.token.symbol}
        imageSrc=${this.token.iconUrl}
        @click=${this.handleSelectButtonClick.bind(this)}
      >
      </wui-token-button>`:(0,d.qy)`<wui-button
      size="md"
      variant="neutral-secondary"
      @click=${this.handleSelectButtonClick.bind(this)}
      >Select token</wui-button
    >`}handleSelectButtonClick(){this.readOnly||h.I.push("WalletSendSelectToken")}sendValueTemplate(){if(!this.readOnly&&this.token&&this.sendTokenAmount){let a=this.token.price*Number(this.sendTokenAmount);return(0,d.qy)`<wui-text class="totalValue" variant="sm-regular" color="secondary"
        >${a?`$${f.S.formatNumberToLocalString(a,2)}`:"Incorrect value"}</wui-text
      >`}return null}maxAmountTemplate(){return this.token?(0,d.qy)` <wui-text variant="sm-regular" color="secondary">
        ${r.Zv.roundNumber(Number(this.token.quantity.numeric),6,5)}
      </wui-text>`:null}actionTemplate(){return this.token?(0,d.qy)`<wui-link @click=${this.onMaxClick.bind(this)}>Max</wui-link>`:null}bottomTemplate(){return this.readOnly?null:(0,d.qy)`<wui-flex alignItems="center" justifyContent="space-between">
      ${this.sendValueTemplate()}
      <wui-flex alignItems="center" gap="01" justifyContent="flex-end">
        ${this.maxAmountTemplate()} ${this.actionTemplate()}
      </wui-flex>
    </wui-flex>`}onInputChange(a){g.R.setTokenAmount(String(a.detail))}onMaxClick(){if(this.token){let a=Number(this.token.quantity.decimals),b=f.S.bigNumber(this.token.quantity.numeric);if(!this.token.address&&this.gasPrice){let c=65000n*BigInt(this.gasPrice),d=f.S.bigNumber(c.toString()).div(f.S.bigNumber(10).pow(a)),e=b.minus(d);g.R.setTokenAmount(e.gt(0)?e.toFixed(a,0):"0")}else g.R.setTokenAmount(b.toFixed(a,0))}}};y.styles=w,x([(0,e.MZ)({type:Object})],y.prototype,"token",void 0),x([(0,e.MZ)({type:Boolean})],y.prototype,"readOnly",void 0),x([(0,e.MZ)({type:String})],y.prototype,"sendTokenAmount",void 0),x([(0,e.MZ)({type:Boolean})],y.prototype,"isInsufficientBalance",void 0),x([(0,e.MZ)({type:String})],y.prototype,"gasPrice",void 0),y=x([(0,r.EM)("w3m-input-token")],y);let z=(0,r.AH)`
  :host {
    display: block;
  }

  wui-flex {
    position: relative;
  }

  wui-icon-box {
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:a})=>a["10"]} !important;
    border: 4px solid ${({tokens:a})=>a.theme.backgroundPrimary};
    background: ${({tokens:a})=>a.theme.foregroundPrimary};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
  }

  wui-button {
    --local-border-radius: ${({borderRadius:a})=>a["4"]} !important;
  }

  .inputContainer {
    height: fit-content;
  }
`;var A=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let B="Insufficient Funds",C="Preview Send",D=class extends d.WF{constructor(){super(),this.unsubscribe=[],this.isTryingToChooseDifferentWallet=!1,this.token=g.R.state.token,this.sendTokenAmount=g.R.state.sendTokenAmount,this.receiverAddress=g.R.state.receiverAddress,this.receiverProfileName=g.R.state.receiverProfileName,this.loading=g.R.state.loading,this.params=h.I.state.data?.send,this.caipAddress=i.W.getAccountData()?.caipAddress,this.disconnecting=!1,this.gasFee=j.GN.state.gasFee,this.token&&!this.params&&(this.fetchBalances(),this.fetchNetworkPrice());const a=i.W.subscribeKey("activeCaipAddress",b=>{!b&&this.isTryingToChooseDifferentWallet&&(this.isTryingToChooseDifferentWallet=!1,k.W.open({view:"Connect",data:{redirectView:"WalletSend"}}).catch(()=>null),a())});this.unsubscribe.push(i.W.subscribeAccountStateProp("caipAddress",a=>{this.caipAddress=a}),g.R.subscribe(a=>{this.token=a.token,this.sendTokenAmount=a.sendTokenAmount,this.receiverAddress=a.receiverAddress,this.receiverProfileName=a.receiverProfileName,this.loading=a.loading}),j.GN.subscribeKey("gasFee",a=>{this.gasFee=a}))}disconnectedCallback(){this.unsubscribe.forEach(a=>a())}async firstUpdated(){await this.handleSendParameters()}render(){let a=this.getMessage(),b=!!this.params;return(0,d.qy)` <wui-flex flexDirection="column" .padding=${["0","4","4","4"]}>
      <wui-flex class="inputContainer" gap="2" flexDirection="column">
        <w3m-input-token
          .token=${this.token}
          .sendTokenAmount=${this.sendTokenAmount}
          .gasPrice=${this.gasFee}
          ?readOnly=${b}
          ?isInsufficientBalance=${a===B}
        ></w3m-input-token>
        <wui-icon-box size="md" variant="secondary" icon="arrowBottom"></wui-icon-box>
        <w3m-input-address
          ?readOnly=${b}
          .value=${this.receiverProfileName?this.receiverProfileName:this.receiverAddress}
        ></w3m-input-address>
      </wui-flex>
      ${this.buttonTemplate(a)}
    </wui-flex>`}async fetchBalances(){await g.R.fetchTokenBalance(),g.R.fetchNetworkBalance()}async fetchNetworkPrice(){await j.GN.getNetworkTokenPrice(),await j.GN.getInitialGasPrice()}onButtonClick(){h.I.push("WalletSendPreview",{send:this.params})}onFundWalletClick(){h.I.push("FundWallet",{redirectView:"WalletSend"})}async onConnectDifferentWalletClick(){try{this.isTryingToChooseDifferentWallet=!0,this.disconnecting=!0,await l.x.disconnect()}finally{this.disconnecting=!1}}getMessage(){return this.token?this.sendTokenAmount?this.token.price&&!(Number(this.sendTokenAmount)*this.token.price)?"Incorrect Value":f.S.bigNumber(this.sendTokenAmount).gt(this.token.quantity.numeric)?B:this.receiverAddress?m.w.isAddress(this.receiverAddress,i.W.state.activeChain)?C:"Invalid Address":"Add Address":"Add Amount":"Select Token"}buttonTemplate(a){let b=!a.startsWith(C),c=a===B,e=!!this.params;return c&&!e?(0,d.qy)`
        <wui-flex .margin=${["4","0","0","0"]} flexDirection="column" gap="4">
          <wui-button
            @click=${this.onFundWalletClick.bind(this)}
            size="lg"
            variant="accent-secondary"
            fullWidth
          >
            Fund Wallet
          </wui-button>

          <wui-separator data-testid="wui-separator" text="or"></wui-separator>

          <wui-button
            @click=${this.onConnectDifferentWalletClick.bind(this)}
            size="lg"
            variant="neutral-secondary"
            fullWidth
            ?loading=${this.disconnecting}
          >
            Connect a different wallet
          </wui-button>
        </wui-flex>
      `:(0,d.qy)`<wui-flex .margin=${["4","0","0","0"]}>
      <wui-button
        @click=${this.onButtonClick.bind(this)}
        ?disabled=${b}
        size="lg"
        variant="accent-primary"
        ?loading=${this.loading}
        fullWidth
      >
        ${a}
      </wui-button>
    </wui-flex>`}async handleSendParameters(){if(this.loading=!0,!this.params){this.loading=!1;return}let a=Number(this.params.amount);if(isNaN(a)){n.P.showError("Invalid amount"),this.loading=!1;return}let{namespace:b,chainId:c,assetAddress:d}=this.params;if(!o.oU.SEND_PARAMS_SUPPORTED_CHAINS.includes(b)){n.P.showError(`Chain "${b}" is not supported for send parameters`),this.loading=!1;return}let e=i.W.getCaipNetworkById(c,b);if(!e){n.P.showError(`Network with id "${c}" not found`),this.loading=!1;return}try{let{balance:b,name:c,symbol:f,decimals:h}=await q.Z.fetchERC20Balance({caipAddress:this.caipAddress,assetAddress:d,caipNetwork:e});if(!c||!f||!h||!b)return void n.P.showError("Token not found");g.R.setToken({name:c,symbol:f,chainId:e.id.toString(),address:`${e.chainNamespace}:${e.id}:${d}`,value:0,price:0,quantity:{decimals:h.toString(),numeric:b.toString()},iconUrl:p.$.getTokenImage(f)??""}),g.R.setTokenAmount(String(a)),g.R.setReceiverAddress(this.params.to)}catch(a){console.error("Failed to load token information:",a),n.P.showError("Failed to load token information")}finally{this.loading=!1}}};D.styles=z,A([(0,e.wk)()],D.prototype,"token",void 0),A([(0,e.wk)()],D.prototype,"sendTokenAmount",void 0),A([(0,e.wk)()],D.prototype,"receiverAddress",void 0),A([(0,e.wk)()],D.prototype,"receiverProfileName",void 0),A([(0,e.wk)()],D.prototype,"loading",void 0),A([(0,e.wk)()],D.prototype,"params",void 0),A([(0,e.wk)()],D.prototype,"caipAddress",void 0),A([(0,e.wk)()],D.prototype,"disconnecting",void 0),A([(0,e.wk)()],D.prototype,"gasFee",void 0),D=A([(0,r.EM)("w3m-wallet-send-view")],D),c(1239),c(7815);let E=(0,r.AH)`
  .contentContainer {
    height: 440px;
    overflow: scroll;
    scrollbar-width: none;
  }

  .contentContainer::-webkit-scrollbar {
    display: none;
  }

  wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:a})=>a["3"]};
  }
`;var F=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let G=class extends d.WF{constructor(){super(),this.unsubscribe=[],this.tokenBalances=g.R.state.tokenBalances,this.search="",this.onDebouncedSearch=m.w.debounce(a=>{this.search=a}),this.fetchBalancesAndNetworkPrice(),this.unsubscribe.push(g.R.subscribe(a=>{this.tokenBalances=a.tokenBalances}))}disconnectedCallback(){this.unsubscribe.forEach(a=>a())}render(){return(0,d.qy)`
      <wui-flex flexDirection="column">
        ${this.templateSearchInput()} <wui-separator></wui-separator> ${this.templateTokens()}
      </wui-flex>
    `}async fetchBalancesAndNetworkPrice(){this.tokenBalances&&this.tokenBalances?.length!==0||(await this.fetchBalances(),await this.fetchNetworkPrice())}async fetchBalances(){await g.R.fetchTokenBalance(),g.R.fetchNetworkBalance()}async fetchNetworkPrice(){await j.GN.getNetworkTokenPrice()}templateSearchInput(){return(0,d.qy)`
      <wui-flex gap="2" padding="3">
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="sm"
          placeholder="Search token"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}templateTokens(){return this.tokens=this.tokenBalances?.filter(a=>a.chainId===i.W.state.activeCaipNetwork?.caipNetworkId),this.search?this.filteredTokens=this.tokenBalances?.filter(a=>a.name.toLowerCase().includes(this.search.toLowerCase())):this.filteredTokens=this.tokens,(0,d.qy)`
      <wui-flex
        class="contentContainer"
        flexDirection="column"
        .padding=${["0","3","0","3"]}
      >
        <wui-flex justifyContent="flex-start" .padding=${["4","3","3","3"]}>
          <wui-text variant="md-medium" color="secondary">Your tokens</wui-text>
        </wui-flex>
        <wui-flex flexDirection="column" gap="2">
          ${this.filteredTokens&&this.filteredTokens.length>0?this.filteredTokens.map(a=>(0,d.qy)`<wui-list-token
                    @click=${this.handleTokenClick.bind(this,a)}
                    ?clickable=${!0}
                    tokenName=${a.name}
                    tokenImageUrl=${a.iconUrl}
                    tokenAmount=${a.quantity.numeric}
                    tokenValue=${a.value}
                    tokenCurrency=${a.symbol}
                  ></wui-list-token>`):(0,d.qy)`<wui-flex
                .padding=${["20","0","0","0"]}
                alignItems="center"
                flexDirection="column"
                gap="4"
              >
                <wui-icon-box icon="coinPlaceholder" color="default" size="lg"></wui-icon-box>
                <wui-flex
                  class="textContent"
                  gap="2"
                  flexDirection="column"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <wui-text variant="lg-medium" align="center" color="primary">
                    No tokens found
                  </wui-text>
                  <wui-text variant="lg-regular" align="center" color="secondary">
                    Your tokens will appear here
                  </wui-text>
                </wui-flex>
                <wui-link @click=${this.onBuyClick.bind(this)}>Buy</wui-link>
              </wui-flex>`}
        </wui-flex>
      </wui-flex>
    `}onBuyClick(){h.I.push("OnRampProviders")}onInputChange(a){this.onDebouncedSearch(a.detail)}handleTokenClick(a){g.R.setToken(a),g.R.setTokenAmount(void 0),h.I.goBack()}};G.styles=E,F([(0,e.wk)()],G.prototype,"tokenBalances",void 0),F([(0,e.wk)()],G.prototype,"tokens",void 0),F([(0,e.wk)()],G.prototype,"filteredTokens",void 0),F([(0,e.wk)()],G.prototype,"search",void 0),G=F([(0,r.EM)("w3m-wallet-send-select-token-view")],G);var H=c(80141),I=c(90999),J=c(85126);c(41686),c(87922),c(35012),c(41074);var K=c(58003),L=c(33440);c(10050);var M=c(38051);let N=(0,M.AH)`
  :host {
    height: 32px;
    display: flex;
    align-items: center;
    gap: ${({spacing:a})=>a[1]};
    border-radius: ${({borderRadius:a})=>a[32]};
    background-color: ${({tokens:a})=>a.theme.foregroundPrimary};
    padding: ${({spacing:a})=>a[1]};
    padding-left: ${({spacing:a})=>a[2]};
  }

  wui-avatar,
  wui-image {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:a})=>a[16]};
  }

  wui-icon {
    border-radius: ${({borderRadius:a})=>a[16]};
  }
`;var O=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let P=class extends d.WF{constructor(){super(...arguments),this.text=""}render(){return(0,d.qy)`<wui-text variant="lg-regular" color="primary">${this.text}</wui-text>
      ${this.imageTemplate()}`}imageTemplate(){return this.address?(0,d.qy)`<wui-avatar address=${this.address} .imageSrc=${this.imageSrc}></wui-avatar>`:this.imageSrc?(0,d.qy)`<wui-image src=${this.imageSrc}></wui-image>`:(0,d.qy)`<wui-icon size="lg" color="inverse" name="networkPlaceholder"></wui-icon>`}};P.styles=[K.W5,K.fD,N],O([(0,e.MZ)({type:String})],P.prototype,"text",void 0),O([(0,e.MZ)({type:String})],P.prototype,"address",void 0),O([(0,e.MZ)({type:String})],P.prototype,"imageSrc",void 0),P=O([(0,L.E)("wui-preview-item")],P);var Q=c(42353);let R=(0,M.AH)`
  :host {
    display: flex;
    padding: ${({spacing:a})=>a[4]} ${({spacing:a})=>a[3]};
    width: 100%;
    background-color: ${({tokens:a})=>a.theme.foregroundPrimary};
    border-radius: ${({borderRadius:a})=>a[4]};
  }

  wui-image {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:a})=>a[16]};
  }

  wui-icon {
    width: 20px;
    height: 20px;
  }
`;var S=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let T=class extends d.WF{constructor(){super(...arguments),this.imageSrc=void 0,this.textTitle="",this.textValue=void 0}render(){return(0,d.qy)`
      <wui-flex justifyContent="space-between" alignItems="center">
        <wui-text variant="lg-regular" color="primary"> ${this.textTitle} </wui-text>
        ${this.templateContent()}
      </wui-flex>
    `}templateContent(){return this.imageSrc?(0,d.qy)`<wui-image src=${this.imageSrc} alt=${this.textTitle}></wui-image>`:this.textValue?(0,d.qy)` <wui-text variant="md-regular" color="secondary"> ${this.textValue} </wui-text>`:(0,d.qy)`<wui-icon size="inherit" color="default" name="networkPlaceholder"></wui-icon>`}};T.styles=[K.W5,K.fD,R],S([(0,e.MZ)()],T.prototype,"imageSrc",void 0),S([(0,e.MZ)()],T.prototype,"textTitle",void 0),S([(0,e.MZ)()],T.prototype,"textValue",void 0),T=S([(0,L.E)("wui-list-content")],T);let U=(0,r.AH)`
  :host {
    display: flex;
    width: auto;
    flex-direction: column;
    gap: ${({spacing:a})=>a["1"]};
    border-radius: ${({borderRadius:a})=>a["5"]};
    background: ${({tokens:a})=>a.theme.foregroundPrimary};
    padding: ${({spacing:a})=>a["3"]} ${({spacing:a})=>a["2"]}
      ${({spacing:a})=>a["2"]} ${({spacing:a})=>a["2"]};
  }

  wui-list-content {
    width: -webkit-fill-available !important;
  }

  wui-text {
    padding: 0 ${({spacing:a})=>a["2"]};
  }

  wui-flex {
    margin-top: ${({spacing:a})=>a["2"]};
  }

  .network {
    cursor: pointer;
    transition: background-color ${({durations:a})=>a.lg}
      ${({easings:a})=>a["ease-out-power-1"]};
    will-change: background-color;
  }

  .network:focus-visible {
    border: 1px solid ${({tokens:a})=>a.core.textAccentPrimary};
    background-color: ${({tokens:a})=>a.core.glass010};
    -webkit-box-shadow: 0px 0px 0px 4px ${({tokens:a})=>a.core.foregroundAccent010};
    -moz-box-shadow: 0px 0px 0px 4px ${({tokens:a})=>a.core.foregroundAccent010};
    box-shadow: 0px 0px 0px 4px ${({tokens:a})=>a.core.foregroundAccent010};
  }

  .network:hover {
    background-color: ${({tokens:a})=>a.core.glass010};
  }

  .network:active {
    background-color: ${({tokens:a})=>a.core.glass010};
  }
`;var V=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let W=class extends d.WF{constructor(){super(...arguments),this.params=h.I.state.data?.send}render(){return(0,d.qy)` <wui-text variant="sm-regular" color="secondary">Details</wui-text>
      <wui-flex flexDirection="column" gap="1">
        <wui-list-content
          textTitle="Address"
          textValue=${r.Zv.getTruncateString({string:this.receiverAddress??"",charsStart:4,charsEnd:4,truncate:"middle"})}
        >
        </wui-list-content>
        ${this.networkTemplate()}
      </wui-flex>`}networkTemplate(){return this.caipNetwork?.name?(0,d.qy)` <wui-list-content
        @click=${()=>this.onNetworkClick(this.caipNetwork)}
        class="network"
        textTitle="Network"
        imageSrc=${(0,Q.J)(p.$.getNetworkImage(this.caipNetwork))}
      ></wui-list-content>`:null}onNetworkClick(a){a&&!this.params&&h.I.push("Networks",{network:a})}};W.styles=U,V([(0,e.MZ)()],W.prototype,"receiverAddress",void 0),V([(0,e.MZ)({type:Object})],W.prototype,"caipNetwork",void 0),V([(0,e.wk)()],W.prototype,"params",void 0),W=V([(0,r.EM)("w3m-wallet-send-details")],W);let X=(0,r.AH)`
  wui-avatar,
  wui-image {
    display: ruby;
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:a})=>a["20"]};
  }

  .sendButton {
    width: 70%;
    --local-width: 100% !important;
    --local-border-radius: ${({borderRadius:a})=>a["4"]} !important;
  }

  .cancelButton {
    width: 30%;
    --local-width: 100% !important;
    --local-border-radius: ${({borderRadius:a})=>a["4"]} !important;
  }
`;var Y=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let Z=class extends d.WF{constructor(){super(),this.unsubscribe=[],this.token=g.R.state.token,this.sendTokenAmount=g.R.state.sendTokenAmount,this.receiverAddress=g.R.state.receiverAddress,this.receiverProfileName=g.R.state.receiverProfileName,this.receiverProfileImageUrl=g.R.state.receiverProfileImageUrl,this.caipNetwork=i.W.state.activeCaipNetwork,this.loading=g.R.state.loading,this.params=h.I.state.data?.send,this.unsubscribe.push(g.R.subscribe(a=>{this.token=a.token,this.sendTokenAmount=a.sendTokenAmount,this.receiverAddress=a.receiverAddress,this.receiverProfileName=a.receiverProfileName,this.receiverProfileImageUrl=a.receiverProfileImageUrl,this.loading=a.loading}),i.W.subscribeKey("activeCaipNetwork",a=>this.caipNetwork=a))}disconnectedCallback(){this.unsubscribe.forEach(a=>a())}render(){return(0,d.qy)` <wui-flex flexDirection="column" .padding=${["0","4","4","4"]}>
      <wui-flex gap="2" flexDirection="column" .padding=${["0","2","0","2"]}>
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-flex flexDirection="column" gap="01">
            <wui-text variant="sm-regular" color="secondary">Send</wui-text>
            ${this.sendValueTemplate()}
          </wui-flex>
          <wui-preview-item
            text="${this.sendTokenAmount?r.Zv.roundNumber(Number(this.sendTokenAmount),6,5):"unknown"} ${this.token?.symbol}"
            .imageSrc=${this.token?.iconUrl}
          ></wui-preview-item>
        </wui-flex>
        <wui-flex>
          <wui-icon color="default" size="md" name="arrowBottom"></wui-icon>
        </wui-flex>
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="sm-regular" color="secondary">To</wui-text>
          <wui-preview-item
            text="${this.receiverProfileName?r.Zv.getTruncateString({string:this.receiverProfileName,charsStart:20,charsEnd:0,truncate:"end"}):r.Zv.getTruncateString({string:this.receiverAddress?this.receiverAddress:"",charsStart:4,charsEnd:4,truncate:"middle"})}"
            address=${this.receiverAddress??""}
            .imageSrc=${this.receiverProfileImageUrl??void 0}
            .isAddress=${!0}
          ></wui-preview-item>
        </wui-flex>
      </wui-flex>
      <wui-flex flexDirection="column" .padding=${["6","0","0","0"]}>
        <w3m-wallet-send-details
          .caipNetwork=${this.caipNetwork}
          .receiverAddress=${this.receiverAddress}
        ></w3m-wallet-send-details>
        <wui-flex justifyContent="center" gap="1" .padding=${["3","0","0","0"]}>
          <wui-icon size="sm" color="default" name="warningCircle"></wui-icon>
          <wui-text variant="sm-regular" color="secondary">Review transaction carefully</wui-text>
        </wui-flex>
        <wui-flex justifyContent="center" gap="3" .padding=${["4","0","0","0"]}>
          <wui-button
            class="cancelButton"
            @click=${this.onCancelClick.bind(this)}
            size="lg"
            variant="neutral-secondary"
          >
            Cancel
          </wui-button>
          <wui-button
            class="sendButton"
            @click=${this.onSendClick.bind(this)}
            size="lg"
            variant="accent-primary"
            .loading=${this.loading}
          >
            Send
          </wui-button>
        </wui-flex>
      </wui-flex></wui-flex
    >`}sendValueTemplate(){if(!this.params&&this.token&&this.sendTokenAmount){let a=this.token.price*Number(this.sendTokenAmount);return(0,d.qy)`<wui-text variant="md-regular" color="primary"
        >$${a.toFixed(2)}</wui-text
      >`}return null}async onSendClick(){if(!this.sendTokenAmount||!this.receiverAddress)return void n.P.showError("Please enter a valid amount and receiver address");try{await g.R.sendToken(),this.params?h.I.reset("WalletSendConfirmed"):(n.P.showSuccess("Transaction started"),h.I.replace("Account"))}catch(d){let a="Failed to send transaction",b=d instanceof I.A&&d.originalName===H.RQ.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST,c=d instanceof I.A&&d.originalName===H.RQ.PROVIDER_RPC_ERROR_NAME.SEND_TRANSACTION_ERROR;(b||c)&&(a=d.message),J.E.sendEvent({type:"track",event:b?"SEND_REJECTED":"SEND_ERROR",properties:g.R.getSdkEventProperties(d)}),n.P.showError(a)}}onCancelClick(){h.I.goBack()}};Z.styles=X,Y([(0,e.wk)()],Z.prototype,"token",void 0),Y([(0,e.wk)()],Z.prototype,"sendTokenAmount",void 0),Y([(0,e.wk)()],Z.prototype,"receiverAddress",void 0),Y([(0,e.wk)()],Z.prototype,"receiverProfileName",void 0),Y([(0,e.wk)()],Z.prototype,"receiverProfileImageUrl",void 0),Y([(0,e.wk)()],Z.prototype,"caipNetwork",void 0),Y([(0,e.wk)()],Z.prototype,"loading",void 0),Y([(0,e.wk)()],Z.prototype,"params",void 0),Z=Y([(0,r.EM)("w3m-wallet-send-preview-view")],Z);let $=(0,r.AH)`
  .icon-box {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background-color: ${({spacing:a})=>a[16]};
    border: 8px solid ${({tokens:a})=>a.theme.borderPrimary};
    border-radius: ${({borderRadius:a})=>a.round};
  }
`,_=class extends d.WF{constructor(){super(),this.unsubscribe=[],this.unsubscribe.push()}render(){return(0,d.qy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding="${["1","3","4","3"]}"
      >
        <wui-flex justifyContent="center" alignItems="center" class="icon-box">
          <wui-icon size="xxl" color="success" name="checkmark"></wui-icon>
        </wui-flex>

        <wui-text variant="h6-medium" color="primary">You successfully sent asset</wui-text>

        <wui-button
          fullWidth
          @click=${this.onCloseClick.bind(this)}
          size="lg"
          variant="neutral-secondary"
        >
          Close
        </wui-button>
      </wui-flex>
    `}onCloseClick(){k.W.close()}};_.styles=$,_=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g}([(0,r.EM)("w3m-send-confirmed-view")],_)}};