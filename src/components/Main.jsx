import { useEffect, useState, useRef } from 'react';

const Main = () => {
  const [synth, setSynth] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [voicesList, setVoicesList] = useState([]);
  const textareaRef = useRef(null);
  const voiceListRef = useRef(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSynth(window.speechSynthesis);
    }
  }, []);

  useEffect(() => {
    if (synth) {
      loadVoices();
      synth.addEventListener('voiceschanged', loadVoices);
    }
  }, [synth]);

  const loadVoices = () => {
    const voices = synth.getVoices();
    const options = voices.map(voice => (
      <option key={voice.name} value={voice.name}>
        {`${voice.name} (${voice.lang})`}
      </option>
    ));
    setVoicesList(options);
  };

  const textToSpeech = () => {
    const text = textareaRef.current.value;
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voiceListRef.current.value;
    utterance.voice = synth.getVoices().find(voice => voice.name === selectedVoice);
    synth.speak(utterance);
  };

  const handleSpeechBtnClick = e => {
    e.preventDefault();
    if (textareaRef.current.value !== '') {
      if (!synth.speaking) {
        textToSpeech();
      }
      if (textareaRef.current.value.length > 80) {
        setInterval(() => {
          if (!synth.speaking && !isSpeaking) {
            setIsSpeaking(true);
          }
        }, 500);
        if (isSpeaking) {
          synth.resume();
          setIsSpeaking(false);
        } else {
          synth.pause();
          setIsSpeaking(true);
        }
      }
    }
  };

  return (
    <div className="justify-center items-center flex h-screen">
      <div className="bg-white w-[370px] py-6 px-6 rounded-lg">
        <form className="">
          <div className="flex justify-center font-semibold text-2xl pb-8">Text To Speech</div>
          <div className="flex flex-col">
            <label className="pb-1 pl-1">Enter Text</label>
            <textarea className="border border-gray-400 p-1 rounded-md focus:outline-none" rows="4" placeholder="Type here..." ref={textareaRef}></textarea>
          </div>
          <div className="flex flex-col pb-3">
            <label className="py-1 pl-1">Select Voice</label>
            <select className="border border-gray-400 rounded-md p-2 focus:outline-none" ref={voiceListRef}>
              {voicesList}
            </select>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white w-full rounded-md py-4 text-[18px]" onClick={handleSpeechBtnClick}>Convert Text To Speech</button>
        </form>
      </div>
    </div>
  );
};

export default Main;
