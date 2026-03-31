import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, saveToken, saveUser } from "../../utils/helpers";
import { sendOTP, verifyOTP, verifyRegistrationOTP, sendRegistrationOTP } from "../../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Nunito',sans-serif; background:#F5C9AA; min-height:100vh; display:flex; align-items:center; justify-content:center; }
  .page-wrapper { background:#F5C9AA; min-height:100vh; width:100%; display:flex; align-items:center; justify-content:center; font-family:'Nunito',sans-serif; }
  .phone-card { background:#fff; border-radius:40px; width:360px; min-height:640px; padding:0 28px 36px; display:flex; flex-direction:column; box-shadow:0 20px 60px rgba(0,0,0,0.12); overflow:hidden; }
  .screen { display:flex; flex-direction:column; flex:1; animation:fadeSlide .35s ease both; }
  @keyframes fadeSlide { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
  .screen.back { animation:fadeBack .35s ease both; }
  @keyframes fadeBack { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
  .illus-wrap { display:flex; justify-content:center; padding:24px 0 8px; }
  .illus-circle { width:100px; height:100px; background:#FDE8D8; border-radius:50%; display:flex; align-items:center; justify-content:center; position:relative; }
  .shield-icon { width:44px; height:44px; }
  .person-svg { position:absolute; right:-12px; bottom:0; }
  .card-title { font-size:20px; font-weight:800; color:#1a1a2e; margin:14px 0 5px; }
  .card-sub { font-size:12px; color:#999; margin-bottom:18px; line-height:1.55; }
  .ro-field { background:#FFF8F4; border:1.5px solid #F97316; border-radius:12px; padding:11px 14px; margin-bottom:10px; display:flex; align-items:center; gap:10px; }
  .ro-icon { font-size:16px; flex-shrink:0; }
  .ro-label { font-size:10px; color:#F97316; font-weight:700; text-transform:uppercase; letter-spacing:.5px; margin-bottom:2px; }
  .ro-value { font-size:13px; font-weight:700; color:#1a1a2e; }
  .ro-lock { margin-left:auto; font-size:13px; opacity:.4; }
  .step-badge { display:inline-flex; align-items:center; gap:8px; background:#F3F4F6; border-radius:30px; padding:5px 14px; margin-bottom:14px; }
  .step-num { width:20px; height:20px; background:#F97316; border-radius:50%; color:#fff; font-size:11px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .step-txt { font-size:12px; font-weight:700; color:#555; }
  .done-badge { display:flex; align-items:center; gap:8px; background:#F0FFF4; border:1px solid #4CAF50; border-radius:30px; padding:7px 14px; margin-bottom:14px; }
  .done-txt { font-size:12px; font-weight:700; color:#16a34a; }
  .otp-boxes { display:flex; gap:10px; justify-content:center; margin:14px 0 6px; }
  .otp-box { width:60px; height:60px; border:1.5px solid #E0E0E0; border-radius:14px; font-size:24px; font-weight:800; text-align:center; font-family:'Nunito',sans-serif; color:#1a1a2e; outline:none; transition:border-color .2s,box-shadow .2s,transform .1s; background:transparent; caret-color:#F97316; }
  .otp-box:focus { border-color:#F97316; box-shadow:0 0 0 3px rgba(249,115,22,.15); transform:scale(1.05); }
  .otp-box.filled { border-color:#F97316; background:#FFF5EF; }
  .otp-box:disabled { background:#fafafa; opacity:.5; }
  .btn-p { width:100%; padding:15px; background:linear-gradient(135deg,#F97316,#F05A1A); color:#fff; border:none; border-radius:50px; font-size:15px; font-weight:700; font-family:'Nunito',sans-serif; cursor:pointer; letter-spacing:.3px; transition:transform .15s,box-shadow .15s; box-shadow:0 6px 20px rgba(249,115,22,.35); }
  .btn-p:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(249,115,22,.4); }
  .btn-p:active { transform:scale(.97); }
  .btn-p:disabled { opacity:.55; cursor:not-allowed; transform:none; box-shadow:none; }
  .err-box { color:#e53e3e; font-size:12px; text-align:center; margin:6px 0 10px; background:#FFF5F5; padding:8px 12px; border-radius:8px; font-weight:600; }
  .timer-row { text-align:center; font-size:12px; color:#bbb; margin:4px 0 14px; }
  .resend-lnk { color:#F97316; font-weight:700; cursor:pointer; }
  .resend-lnk:hover { text-decoration:underline; }
  .hint-txt { font-size:11px; color:#ccc; margin-bottom:14px; line-height:1.5; }
  .progress-row { display:flex; justify-content:center; gap:6px; margin-bottom:20px; }
  .dot { width:8px; height:8px; border-radius:50%; background:#E0E0E0; transition:background .3s,width .3s; }
  .dot.active { background:#F97316; width:24px; border-radius:4px; }
  .success-wrap { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; text-align:center; padding:40px 0; animation:popIn .4s cubic-bezier(.34,1.56,.64,1) both; }
  @keyframes popIn { from{opacity:0;transform:scale(.7)} to{opacity:1;transform:scale(1)} }
  .success-circle { width:100px; height:100px; background:linear-gradient(135deg,#F97316,#F05A1A); border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:22px; box-shadow:0 12px 36px rgba(249,115,22,.4); }
  .success-title { font-size:22px; font-weight:800; color:#1a1a2e; margin-bottom:8px; }
  .success-sub { font-size:13px; color:#999; margin-bottom:32px; line-height:1.6; }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
`;

const ShieldIcon = () => (
  <svg className="shield-icon" viewBox="0 0 52 52" fill="none">
    <path d="M26 4L8 12v14c0 10.5 7.7 20.3 18 22.7C36.3 46.3 44 36.5 44 26V12L26 4z" fill="#fff" stroke="#F97316" strokeWidth="2"/>
    <path d="M19 26l5 5 9-9" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PersonIcon = () => (
  <svg className="person-svg" width="60" height="80" viewBox="0 0 72 96" fill="none">
    <ellipse cx="36" cy="18" rx="11" ry="11" fill="#F9C5A0"/>
    <rect x="20" y="32" width="32" height="38" rx="8" fill="#2D2D2D"/>
    <rect x="22" y="36" width="10" height="5" rx="2" fill="#F97316"/>
    <path d="M20 46 Q10 52 8 68" stroke="#F9C5A0" strokeWidth="6" strokeLinecap="round"/>
    <path d="M52 46 Q62 52 64 68" stroke="#F9C5A0" strokeWidth="6" strokeLinecap="round"/>
    <path d="M28 70 Q26 84 24 94" stroke="#2D2D2D" strokeWidth="7" strokeLinecap="round"/>
    <path d="M44 70 Q46 84 48 94" stroke="#2D2D2D" strokeWidth="7" strokeLinecap="round"/>
  </svg>
);

function ROField({ icon, label, value }) {
  return (
    <div className="ro-field">
      <span className="ro-icon">{icon}</span>
      <div style={{ flex: 1 }}>
        <p className="ro-label">{label}</p>
        <p className="ro-value">{value}</p>
      </div>
      <span className="ro-lock">🔒</span>
    </div>
  );
}

function OtpBoxes({ digits, setDigits, refs, disabled, shake }) {
  const onChange = (i, val) => {
    const v = val.replace(/\D/g, '').slice(-1);
    const d = [...digits]; d[i] = v; setDigits(d);
    if (v && i < 3) refs[i + 1].current?.focus();
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace') {
      if (digits[i]) { const d = [...digits]; d[i] = ''; setDigits(d); }
      else if (i > 0) refs[i - 1].current?.focus();
    }
  };
  return (
    <div className="otp-boxes" style={shake ? { animation: 'shake .4s ease' } : {}}>
      {digits.map((d, i) => (
        <input key={i} ref={refs[i]}
          className={`otp-box${d ? ' filled' : ''}`}
          maxLength={1} value={d} inputMode="numeric"
          onChange={e => onChange(i, e.target.value)}
          onKeyDown={e => onKey(i, e)}
          disabled={disabled} />
      ))}
    </div>
  );
}

function useTimer(init = 0) {
  const [t, setT] = useState(init);
  useEffect(() => {
    if (t <= 0) return;
    const id = setTimeout(() => setT(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [t]);
  return [t, setT];
}

/* ══════════════════════════════════════════════
   FLOW A — REGISTRATION  (4 manual sub-steps)
   1. See email → click "Send Email OTP"
   2. Enter email OTP → click "Verify Email"
   3. See phone → click "Send Phone OTP"
   4. Enter phone OTP → click "Create Account"
══════════════════════════════════════════════ */
function RegistrationVerifyScreen({ email, phone }) {
  const navigate = useNavigate();

  const SUBS = { E_SEND:'email_send', E_OTP:'email_otp', P_SEND:'phone_send', P_OTP:'phone_otp' };
  const [sub,         setSub]         = useState(SUBS.E_SEND);
  const [emailDigits, setEmailDigits] = useState(['','','','']);
  const [phoneDigits, setPhoneDigits] = useState(['','','','']);
  const [verifiedEmailCode, setVEC]   = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [shake,       setShake]       = useState(false);
  const [emailTimer,  setEmailTimer]  = useTimer(0);
  const [phoneTimer,  setPhoneTimer]  = useTimer(0);

  const eRefs = [useRef(),useRef(),useRef(),useRef()];
  const pRefs = [useRef(),useRef(),useRef(),useRef()];

  const focus1 = (refs) => setTimeout(() => refs[0].current?.focus(), 80);

  const doShake = (which) => {
    setShake(true);
    if (which === 'e') setEmailDigits(['','','','']);
    if (which === 'p') setPhoneDigits(['','','','']);
    setTimeout(() => {
      setShake(false);
      focus1(which === 'e' ? eRefs : pRefs);
    }, 500);
  };

  // ── 1. Send email OTP ──
  const sendEmailOTP = async () => {
    setLoading(true); setError('');
    try {
      await sendRegistrationOTP(email, 'email');
      setSub(SUBS.E_OTP);
      setEmailTimer(60);
      focus1(eRefs);
    } catch (err) { setError(err.message || 'Failed to send. Try again.'); }
    finally { setLoading(false); }
  };

  // ── 2. Verify email OTP ──
  const verifyEmailOTP = async () => {
    const code = emailDigits.join('');
    if (code.length < 4) { setError('Please enter all 4 digits.'); return; }
    setLoading(true); setError('');
    try {
      await sendRegistrationOTP(email, 'verify_email', code);
      setVEC(code);
      setSub(SUBS.P_SEND);
    } catch (err) { setError(err.message || 'Invalid OTP. Try again.'); doShake('e'); }
    finally { setLoading(false); }
  };

  // ── 3. Send phone OTP ──
  const sendPhoneOTP = async () => {
    setLoading(true); setError('');
    try {
      await sendRegistrationOTP(email, 'phone', '', phone);
      setSub(SUBS.P_OTP);
      setPhoneTimer(60);
      focus1(pRefs);
    } catch (err) { setError(err.message || 'Failed to send. Try again.'); }
    finally { setLoading(false); }
  };

  // ── 4. Verify phone OTP → create account ──
  const verifyPhoneOTP = async () => {
    const code = phoneDigits.join('');
    if (code.length < 4) { setError('Please enter all 4 digits.'); return; }
    setLoading(true); setError('');
    try {
      const data = await verifyRegistrationOTP(email, verifiedEmailCode, code);
      saveToken(data); saveUser(data);
      navigate('/dashboard');
    } catch (err) { setError(err.message || 'Invalid OTP. Try again.'); doShake('p'); }
    finally { setLoading(false); }
  };

  const maskedEmail = email?.replace(/(.{2})(.*)(@.*)/, '$1***$3');
  const maskedPhone = phone ? `${phone.slice(0,3)}****${phone.slice(-3)}` : '';
  const dotActive   = sub===SUBS.E_SEND||sub===SUBS.E_OTP ? (sub===SUBS.E_SEND?0:1) : 2;

  return (
    <div className="screen">
      {/* dots */}
      <div style={{ paddingTop:18 }}>
        <div className="progress-row">
          {[0,1,2].map(i => <div key={i} className={`dot${dotActive===i?' active':''}`} />)}
        </div>
      </div>

      <div className="illus-wrap">
        <div className="illus-circle"><ShieldIcon /><PersonIcon /></div>
      </div>

      {error && <p className="err-box">⚠️ {error}</p>}

      {/* ── STEP 1: Show email + Send button ── */}
      {sub === SUBS.E_SEND && (
        <>
          <h2 className="card-title">Verify Email</h2>
          <p className="card-sub">Step 1 of 2 · Tap the button to send a 4-digit OTP to your email.</p>
          <div className="step-badge">
            <span className="step-num">1</span>
            <span className="step-txt">Email Verification</span>
          </div>
          <ROField icon="📧" label="Email Address" value={maskedEmail} />
          <p className="hint-txt">Email is pre-filled from your registration form and cannot be changed.</p>
          <div style={{ flex:1 }} />
          <button className="btn-p" onClick={sendEmailOTP} disabled={loading}>
            {loading ? '⏳ Sending...' : '📧 Send Email OTP'}
          </button>
        </>
      )}

      {/* ── STEP 2: Enter email OTP ── */}
      {sub === SUBS.E_OTP && (
        <>
          <h2 className="card-title">Enter Email OTP</h2>
          <p className="card-sub">Step 1 of 2 · Enter the 4-digit code sent to your email.</p>
          <div className="step-badge">
            <span className="step-num">1</span>
            <span className="step-txt">Email Verification</span>
          </div>
          <ROField icon="📧" label="OTP sent to" value={maskedEmail} />
          <OtpBoxes digits={emailDigits} setDigits={setEmailDigits} refs={eRefs} disabled={loading} shake={shake} />
          <p className="timer-row">
            {emailTimer > 0
              ? <>Resend in <strong style={{ color:'#F97316' }}>{emailTimer}s</strong></>
              : <>Didn't get it?{' '}<span className="resend-lnk" onClick={() => { setEmailTimer(60); sendEmailOTP(); }}>Resend OTP</span></>
            }
          </p>
          <div style={{ flex:1 }} />
          <button className="btn-p" onClick={verifyEmailOTP} disabled={loading}>
            {loading ? '⏳ Verifying...' : '✅ Verify Email'}
          </button>
        </>
      )}

      {/* ── STEP 3: Show phone + Send button ── */}
      {sub === SUBS.P_SEND && (
        <>
          <div className="done-badge">
            <span style={{ fontSize:16 }}>✅</span>
            <span className="done-txt">Email verified successfully!</span>
          </div>
          <h2 className="card-title">Verify Phone</h2>
          <p className="card-sub">Step 2 of 2 · Tap the button to send a 4-digit OTP to your phone.</p>
          <div className="step-badge">
            <span className="step-num">2</span>
            <span className="step-txt">Phone Verification</span>
          </div>
          <ROField icon="📱" label="Phone Number" value={maskedPhone} />
          <p className="hint-txt">Phone number is pre-filled from your registration form and cannot be changed.</p>
          <div style={{ flex:1 }} />
          <button className="btn-p" onClick={sendPhoneOTP} disabled={loading}>
            {loading ? '⏳ Sending...' : '📱 Send Phone OTP'}
          </button>
        </>
      )}

      {/* ── STEP 4: Enter phone OTP ── */}
      {sub === SUBS.P_OTP && (
        <>
          <div className="done-badge">
            <span style={{ fontSize:16 }}>✅</span>
            <span className="done-txt">Email verified successfully!</span>
          </div>
          <h2 className="card-title">Enter Phone OTP</h2>
          <p className="card-sub">Step 2 of 2 · Enter the 4-digit code sent to your phone.</p>
          <div className="step-badge">
            <span className="step-num">2</span>
            <span className="step-txt">Phone Verification</span>
          </div>
          <ROField icon="📱" label="OTP sent to" value={maskedPhone} />
          <OtpBoxes digits={phoneDigits} setDigits={setPhoneDigits} refs={pRefs} disabled={loading} shake={shake} />
          <p className="timer-row">
            {phoneTimer > 0
              ? <>Resend in <strong style={{ color:'#F97316' }}>{phoneTimer}s</strong></>
              : <>Didn't get it?{' '}<span className="resend-lnk" onClick={() => { setPhoneTimer(60); sendPhoneOTP(); }}>Resend OTP</span></>
            }
          </p>
          <div style={{ flex:1 }} />
          <button className="btn-p" onClick={verifyPhoneOTP} disabled={loading}>
            {loading ? '⏳ Creating Account...' : '🚀 Verify & Create Account'}
          </button>
        </>
      )}

      <p style={{ textAlign:'center', marginTop:12, fontSize:11, color:'#ccc' }}>
        Wrong details?{' '}
        <span style={{ color:'#F97316', fontWeight:700, cursor:'pointer' }} onClick={() => navigate('/register')}>
          Go back to Register
        </span>
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FLOW B — POST-LOGIN (unchanged step-by-step)
══════════════════════════════════════════════ */
function PostLoginScreen({ prefillEmail, prefillPhone, onContinue }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const mE = prefillEmail?.replace(/(.{2})(.*)(@.*)/, '$1***$3');
  const mP = prefillPhone ? `${prefillPhone.slice(0,3)}****${prefillPhone.slice(-3)}` : '';

  const handleSend = async () => {
    setError(''); setLoading(true);
    try {
      await sendOTP('email');
      await sendOTP('phone');
      onContinue({ email: prefillEmail, phone: prefillPhone });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="screen">
      <div className="illus-wrap">
        <div className="illus-circle"><ShieldIcon /><PersonIcon /></div>
      </div>
      <h2 className="card-title">OTP Verification</h2>
      <p className="card-sub">Verify your registered email and phone number.</p>
      {error && <p className="err-box">⚠️ {error}</p>}
      <ROField icon="📧" label="Email Address" value={mE || prefillEmail} />
      <ROField icon="📱" label="Phone Number"  value={mP || prefillPhone} />
      <div style={{ flex:1 }} />
      <button className="btn-p" onClick={handleSend} disabled={loading}>
        {loading ? '⏳ Sending...' : 'Send OTP'}
      </button>
    </div>
  );
}

function OtpScreen({ type, target, onVerify, onBack, isBack }) {
  const [digits,  setDigits]  = useState(['','','','']);
  const [shake,   setShake]   = useState(false);
  const [timer,   setTimer]   = useTimer(30);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const refs = [useRef(),useRef(),useRef(),useRef()];

  useEffect(() => { refs[0].current?.focus(); }, []);

  const handleConfirm = async () => {
    const code = digits.join('');
    if (code.length < 4) { setShake(true); setTimeout(() => setShake(false), 500); return; }
    setLoading(true); setError('');
    try {
      await verifyOTP(type === 'mobile' ? 'phone' : 'email', code);
      onVerify();
    } catch (err) {
      setError(err.message); setShake(true);
      setDigits(['','','','']);
      setTimeout(() => { setShake(false); refs[0].current?.focus(); }, 500);
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setTimer(30); setError(''); setDigits(['','','','']);
    try { await sendOTP(type === 'mobile' ? 'phone' : 'email'); }
    catch { setError('Failed to resend.'); }
  };

  const masked = type === 'email'
    ? target?.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    : `${target?.slice(0,4)} ****${target?.slice(-4)}`;

  return (
    <div className={`screen${isBack ? ' back' : ''}`}>
      <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', fontSize:20, color:'#555', padding:'22px 0 10px', display:'flex', alignItems:'center', gap:6, fontFamily:'Nunito,sans-serif' }}>←</button>
      <h2 className="card-title">Verification Code</h2>
      <p className="card-sub">Code sent to your {type === 'email' ? 'email' : 'phone'}</p>
      <p style={{ fontSize:13, color:'#F97316', fontWeight:700, marginBottom:16 }}>{masked}</p>
      {error && <p className="err-box">⚠️ {error}</p>}
      <OtpBoxes digits={digits} setDigits={setDigits} refs={refs} disabled={loading} shake={shake} />
      <p className="timer-row">
        {timer > 0
          ? <>Resend in <strong style={{ color:'#F97316' }}>{timer}s</strong></>
          : <span className="resend-lnk" onClick={handleResend}>Resend OTP</span>
        }
      </p>
      <div style={{ flex:1 }} />
      <button className="btn-p" onClick={handleConfirm} disabled={loading} style={{ opacity: loading?.7:1 }}>
        {loading ? '⏳ Verifying...' : 'Confirm'}
      </button>
    </div>
  );
}

function ChoiceScreen({ userData, emailDone, mobileDone, onChoose, onFinish }) {
  if (emailDone && mobileDone) return (
    <div className="screen">
      <div className="success-wrap">
        <div className="success-circle">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <path d="M10 22l9 9 15-15" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="success-title">All Verified!</h2>
        <p className="success-sub">Email and phone successfully verified.</p>
        <button className="btn-p" style={{ width:'100%' }} onClick={onFinish}>Continue</button>
      </div>
    </div>
  );

  const done  = [emailDone, mobileDone].filter(Boolean).length;
  const items = [
    { d:emailDone,  icon:'📧', label:emailDone?'Email Verified':'Verify Email', sub:userData?.email?.replace(/(.{2})(.*)(@.*)/, '$1***$3'), type:'email' },
    { d:mobileDone, icon:'📱', label:mobileDone?'Mobile Verified':'Verify Mobile', sub:`${userData?.phone?.slice(0,4)} ****${userData?.phone?.slice(-4)}`, type:'mobile' },
  ];

  return (
    <div className="screen">
      <div style={{ padding:'28px 0 16px' }}>
        <h2 className="card-title">Verify Your Account</h2>
        <p className="card-sub">Verify email first, then phone.</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {items.map(({ d, icon, label, sub, type }) => (
          <div key={type} onClick={() => !d && onChoose(type)} style={{
            border:`1.5px solid ${d?'#4CAF50':'#F97316'}`, borderRadius:16,
            padding:'14px 16px', display:'flex', alignItems:'center', gap:12,
            cursor:d?'default':'pointer', background:d?'#F1FFF4':'#FFF8F4',
          }}>
            <div style={{ width:40, height:40, borderRadius:'50%', background:d?'#4CAF50':'#FFE8D6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
              {d ? '✓' : icon}
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:700, fontSize:13, color:'#1a1a2e' }}>{label}</p>
              <p style={{ fontSize:11, color:'#999', marginTop:2 }}>{sub}</p>
            </div>
            {!d && <span style={{ color:'#F97316', fontWeight:700, fontSize:12 }}>Tap →</span>}
            {d  && <span style={{ color:'#4CAF50', fontWeight:700, fontSize:16 }}>✓</span>}
          </div>
        ))}
      </div>
      <div style={{ marginTop:22 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ fontSize:11, color:'#999' }}>Progress</span>
          <span style={{ fontSize:11, color:'#F97316', fontWeight:700 }}>{done}/2</span>
        </div>
        <div style={{ height:5, background:'#F0E0D6', borderRadius:3, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${done*50}%`, background:'linear-gradient(90deg,#F97316,#F05A1A)', borderRadius:3, transition:'width .4s ease' }} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════ */
export default function OtpVerification() {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegistrationFlow = location.state?.autoSent === true;
  const emailFromState     = location.state?.email || '';
  const phoneFromState     = location.state?.phone || '';

  const loggedInUser = getCurrentUser();
  const prefillEmail = emailFromState || loggedInUser?.email || '';
  const prefillPhone = phoneFromState || loggedInUser?.phone_number || '';

  const [step,       setStep]       = useState('info');
  const [userData,   setUserData]   = useState(null);
  const [verifying,  setVerifying]  = useState(null);
  const [emailDone,  setEmailDone]  = useState(false);
  const [mobileDone, setMobileDone] = useState(false);
  const [isBack,     setIsBack]     = useState(false);

  const go = (s, back=false) => { setIsBack(back); setStep(s); };
  const stepDot = step==='info'?0:step==='choose'?1:step==='otp'?2:3;

  // ── FLOW A ──
  if (isRegistrationFlow) {
    return (
      <>
        <style>{styles}</style>
        <div className="page-wrapper">
          <div className="phone-card">
            <RegistrationVerifyScreen email={emailFromState} phone={phoneFromState} />
          </div>
        </div>
      </>
    );
  }

  // ── FLOW B ──
  return (
    <>
      <style>{styles}</style>
      <div className="page-wrapper">
        <div className="phone-card">
          <div style={{ paddingTop:18 }}>
            <div className="progress-row">
              {[0,1,2,3].map(i => <div key={i} className={`dot${stepDot===i?' active':''}`} />)}
            </div>
          </div>
          {step === 'info' && (
            <PostLoginScreen prefillEmail={prefillEmail} prefillPhone={prefillPhone}
              onContinue={(d) => { setUserData(d); go('choose'); }} />
          )}
          {step === 'choose' && (
            <ChoiceScreen userData={userData} emailDone={emailDone} mobileDone={mobileDone}
              onChoose={(t) => { setVerifying(t); go('otp'); }}
              onFinish={() => go('done')} />
          )}
          {step === 'otp' && (
            <OtpScreen type={verifying}
              target={verifying==='email' ? userData?.email : userData?.phone}
              onVerify={() => { verifying==='email' ? setEmailDone(true) : setMobileDone(true); go('choose', true); }}
              onBack={() => go('choose', true)} isBack={isBack} />
          )}
          {step === 'done' && (
            <div className="screen">
              <div className="success-wrap">
                <div className="success-circle" style={{ width:100, height:100 }}>
                  <svg width="48" height="48" viewBox="0 0 52 52" fill="none">
                    <path d="M12 26l11 11 17-17" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="success-title">Welcome to Smanto!</h2>
                <p className="success-sub">Your account is fully verified.</p>
                <button className="btn-p" style={{ width:'100%' }} onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}