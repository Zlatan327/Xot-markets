"use strict";exports.id=3488,exports.ids=[3488],exports.modules={13488:(a,b,c)=>{c.r(b),c.d(b,{W3mWalletReceiveView:()=>x});var d=c(53478),e=c(96313),f=c(42353),g=c(37662),h=c(99257),i=c(78743),j=c(67090),k=c(44662),l=c(62970),m=c(63860),n=c(96214);c(41686),c(87922),c(35012),c(41074);var o=c(58003),p=c(33440),q=c(38051);let r=(0,q.AH)`
  button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:a})=>a[4]};
    background-color: ${({tokens:a})=>a.theme.foregroundPrimary};
    border-radius: ${({borderRadius:a})=>a[3]};
    border: none;
    padding: ${({spacing:a})=>a[3]};
    transition: background-color ${({durations:a})=>a.lg}
      ${({easings:a})=>a["ease-out-power-2"]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button:hover:enabled,
  button:active:enabled {
    background-color: ${({tokens:a})=>a.theme.foregroundSecondary};
  }

  wui-text {
    flex: 1;
    color: ${({tokens:a})=>a.theme.textSecondary};
  }

  wui-flex {
    width: auto;
    display: flex;
    align-items: center;
    gap: ${({spacing:a})=>a["01"]};
  }

  wui-icon {
    color: ${({tokens:a})=>a.theme.iconDefault};
  }

  .network-icon {
    position: relative;
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:a})=>a[4]};
    overflow: hidden;
    margin-left: -8px;
  }

  .network-icon:first-child {
    margin-left: 0px;
  }

  .network-icon:after {
    position: absolute;
    inset: 0;
    content: '';
    display: block;
    height: 100%;
    width: 100%;
    border-radius: ${({borderRadius:a})=>a[4]};
    box-shadow: inset 0 0 0 1px ${({tokens:a})=>a.core.glass010};
  }
`;var s=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let t=class extends d.WF{constructor(){super(...arguments),this.networkImages=[""],this.text=""}render(){return(0,d.qy)`
      <button>
        <wui-text variant="md-regular" color="inherit">${this.text}</wui-text>
        <wui-flex>
          ${this.networksTemplate()}
          <wui-icon name="chevronRight" size="sm" color="inherit"></wui-icon>
        </wui-flex>
      </button>
    `}networksTemplate(){let a=this.networkImages.slice(0,5);return(0,d.qy)` <wui-flex class="networks">
      ${a?.map(a=>(0,d.qy)` <wui-flex class="network-icon"> <wui-image src=${a}></wui-image> </wui-flex>`)}
    </wui-flex>`}};t.styles=[o.W5,o.fD,r],s([(0,e.MZ)({type:Array})],t.prototype,"networkImages",void 0),s([(0,e.MZ)()],t.prototype,"text",void 0),t=s([(0,p.E)("wui-compatible-network")],t),c(64436),c(86179),c(82268);var u=c(84794);let v=(0,n.AH)`
  wui-compatible-network {
    margin-top: ${({spacing:a})=>a["4"]};
    width: 100%;
  }

  wui-qr-code {
    width: unset !important;
    height: unset !important;
  }

  wui-icon {
    align-items: normal;
  }
`;var w=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let x=class extends d.WF{constructor(){super(),this.unsubscribe=[],this.address=g.W.getAccountData()?.address,this.profileName=g.W.getAccountData()?.profileName,this.network=g.W.state.activeCaipNetwork,this.unsubscribe.push(g.W.subscribeChainProp("accountState",a=>{a?(this.address=a.address,this.profileName=a.profileName):h.P.showError("Account not found")}),g.W.subscribeKey("activeCaipNetwork",a=>{a?.id&&(this.network=a)}))}disconnectedCallback(){this.unsubscribe.forEach(a=>a())}render(){if(!this.address)throw Error("w3m-wallet-receive-view: No account provided");let a=i.$.getNetworkImage(this.network);return(0,d.qy)` <wui-flex
      flexDirection="column"
      .padding=${["0","4","4","4"]}
      alignItems="center"
    >
      <wui-chip-button
        data-testid="receive-address-copy-button"
        @click=${this.onCopyClick.bind(this)}
        text=${n.Zv.getTruncateString({string:this.profileName||this.address||"",charsStart:this.profileName?18:4,charsEnd:4*!this.profileName,truncate:this.profileName?"end":"middle"})}
        icon="copy"
        size="sm"
        imageSrc=${a||""}
        variant="gray"
      ></wui-chip-button>
      <wui-flex
        flexDirection="column"
        .padding=${["4","0","0","0"]}
        alignItems="center"
        gap="4"
      >
        <wui-qr-code
          size=${232}
          theme=${j.W.state.themeMode}
          uri=${this.address}
          ?arenaClear=${!0}
          color=${(0,f.J)(j.W.state.themeVariables["--apkt-qr-color"]??j.W.state.themeVariables["--w3m-qr-color"])}
          data-testid="wui-qr-code"
        ></wui-qr-code>
        <wui-text variant="lg-regular" color="primary" align="center">
          Copy your address or scan this QR code
        </wui-text>
        <wui-button @click=${this.onCopyClick.bind(this)} size="sm" variant="neutral-secondary">
          <wui-icon slot="iconLeft" size="sm" color="inherit" name="copy"></wui-icon>
          <wui-text variant="md-regular" color="inherit">Copy address</wui-text>
        </wui-button>
      </wui-flex>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){let a=g.W.getAllRequestedCaipNetworks(),b=g.W.checkIfSmartAccountEnabled(),c=g.W.state.activeCaipNetwork,e=a.filter(a=>a?.chainNamespace===c?.chainNamespace);if((0,k.lj)(c?.chainNamespace)===u.Vl.ACCOUNT_TYPES.SMART_ACCOUNT&&b)return c?(0,d.qy)`<wui-compatible-network
        @click=${this.onReceiveClick.bind(this)}
        text="Only receive assets on this network"
        .networkImages=${[i.$.getNetworkImage(c)??""]}
      ></wui-compatible-network>`:null;let f=(e?.filter(a=>a?.assets?.imageId)?.slice(0,5)).map(i.$.getNetworkImage).filter(Boolean);return(0,d.qy)`<wui-compatible-network
      @click=${this.onReceiveClick.bind(this)}
      text="Only receive assets on these networks"
      .networkImages=${f}
    ></wui-compatible-network>`}onReceiveClick(){l.I.push("WalletCompatibleNetworks")}onCopyClick(){try{this.address&&(m.w.copyToClopboard(this.address),h.P.showSuccess("Address copied"))}catch{h.P.showError("Failed to copy")}}};x.styles=v,w([(0,e.wk)()],x.prototype,"address",void 0),w([(0,e.wk)()],x.prototype,"profileName",void 0),w([(0,e.wk)()],x.prototype,"network",void 0),x=w([(0,n.EM)("w3m-wallet-receive-view")],x)}};