import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/router";
import { useReactiveVar } from "@apollo/client";
import { useTranslation } from "react-i18next";
import ScrollableFeed from "react-scrollable-feed";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { socketVar, userVar } from "@/apollo/store";
import { REACT_APP_API_URL } from "@/libs/config";
import { Member } from "../types/member/member";

const resolveAvatar = (path?: string) =>
  path
    ? /^https?:\/\//.test(path)
      ? path
      : `${REACT_APP_API_URL}/${path}`
    : "/img/profile/defaultUser.png";

const PawBubble = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      className="glyph-bubble"
      d="M12 2.4c-5.5 0-10 3.7-10 8.4 0 4.6 4.5 8.4 10 8.4.9 0 1.8-.1 2.6-.3l3.9 2.3c.4.3 1-.1.9-.6l-.6-3.2c2-1.5 3.2-3.7 3.2-6.6 0-4.7-4.5-8.4-10-8.4z"
    />
    <g
      className="glyph-paw"
      transform="translate(12 10.6) scale(0.5) translate(-12 -12.6)"
    >
      <ellipse cx="12" cy="16.4" rx="5.6" ry="4.6" />
      <ellipse
        cx="5.5"
        cy="10.4"
        rx="2.5"
        ry="3.2"
        transform="rotate(-20 5.5 10.4)"
      />
      <ellipse
        cx="9.9"
        cy="7.2"
        rx="2.4"
        ry="3.3"
        transform="rotate(-7 9.9 7.2)"
      />
      <ellipse
        cx="14.5"
        cy="7.2"
        rx="2.4"
        ry="3.3"
        transform="rotate(7 14.5 7.2)"
      />
      <ellipse
        cx="18.9"
        cy="10.4"
        rx="2.5"
        ry="3.2"
        transform="rotate(20 18.9 10.4)"
      />
    </g>
  </svg>
);

interface MessagePayload {
  event: string;
  text: string;
  memberData: Member;
}

interface InfoPayload {
  event: string;
  totalClients: number;
  memberData: Member;
  action: string;
}

const Chat = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const socket = useReactiveVar(socketVar);

  const [open, setOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [unseen, setUnseen] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);

  /** LIFECYCLES **/

  useEffect(() => {
    if (!socket) return;

    const handler = (msg: MessageEvent) => {
      const data = JSON.parse(msg.data);

      switch (data.event) {
        case "info":
          const newInfo: InfoPayload = data;
          setOnlineUsers(newInfo.totalClients);
          break;
        case "getMessages":
          const list: MessagePayload[] = data.list;
          setMessagesList(list);
          break;
        case "message":
          const newMessage: MessagePayload = data;
          setMessagesList((prev) => [...prev, newMessage]);
          if (!open) setUnseen((prev) => prev + 1);
          break;
      }
    };

    socket.addEventListener("message", handler);
    return () => socket.removeEventListener("message", handler);
  }, [socket, open]);

  useEffect(() => {
    setOpen(false);
  }, [router.pathname]);

  useEffect(() => {
    if (open) {
      setUnseen(0);
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  /** HANDLERS **/

  const handleToggle = () => setOpen((prev) => !prev);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "Enter") {
      // Ignore Enter while an IME (Korean/Japanese/Chinese) is still composing:
      // it fires an extra keydown that would re-send the last character.
      // keyCode 229 covers Safari, where isComposing is unreliable.
      if (event.nativeEvent.isComposing || event.keyCode === 229) return;
      handleSend();
    }
  };

  const handleSend = () => {
    const text = messageInput.trim();
    if (!text || !socket) return;

    socket.send(JSON.stringify({ event: "message", data: text }));
    setMessageInput("");
    inputRef.current?.focus();
  };

  const othersOnline = onlineUsers > 0;
  const presenceLine = othersOnline
    ? t("chat.online", { count: onlineUsers })
    : t("chat.onlyYou");

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel" role="dialog" aria-label={t("chat.title")}>
          <div className="chat-panel-header">
            <span className="chat-panel-mark" aria-hidden="true">
              <PawBubble className="chat-mark-glyph" />
            </span>
            <div className="chat-panel-heading">
              <div className="chat-panel-title">{t("chat.title")}</div>
              <div className="chat-panel-presence">
                <span className="chat-live-dot" aria-hidden="true" />
                {presenceLine}
              </div>
            </div>
            <button
              type="button"
              className="chat-panel-close"
              onClick={() => setOpen(false)}
              aria-label={t("chat.closeLabel")}
            >
              <CloseRoundedIcon />
            </button>
          </div>

          <div className="chat-panel-body">
            <ScrollableFeed>
              <div className="chat-msg-row in">
                <span className="chat-msg-avatar brand" aria-hidden="true">
                  <PawBubble className="chat-avatar-glyph" />
                </span>
                <div className="chat-msg-group">
                  <span className="chat-msg-name">Petora</span>
                  <div className="chat-msg-bubble">{t("chat.welcome")}</div>
                </div>
              </div>
              {messagesList.map((chat, index) => {
                const mine = chat.memberData?._id === user?._id;
                const name =
                  chat.memberData?.memberFullName ||
                  chat.memberData?.memberUserName ||
                  "Guest";

                return mine ? (
                  <div className="chat-msg-row out" key={index}>
                    <div className="chat-msg-group">
                      <div className="chat-msg-bubble">{chat.text}</div>
                    </div>
                    <img
                      className="chat-msg-avatar"
                      src={resolveAvatar(chat.memberData?.memberImage)}
                      alt=""
                      aria-hidden="true"
                    />
                  </div>
                ) : (
                  <div className="chat-msg-row in" key={index}>
                    <img
                      className="chat-msg-avatar"
                      src={resolveAvatar(chat.memberData?.memberImage)}
                      alt=""
                      aria-hidden="true"
                    />
                    <div className="chat-msg-group">
                      <span className="chat-msg-name">{name}</span>
                      <div className="chat-msg-bubble">{chat.text}</div>
                    </div>
                  </div>
                );
              })}
            </ScrollableFeed>
          </div>

          <div className="chat-panel-footer">
            <input
              ref={inputRef}
              type="text"
              className="chat-panel-input"
              placeholder={t("chat.placeholder")}
              maxLength={500}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label={t("chat.placeholder")}
            />
            <button
              type="button"
              className="chat-panel-send"
              onClick={handleSend}
              disabled={!messageInput.trim()}
              aria-label={t("chat.send")}
            >
              <SendRoundedIcon />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="chat-toggle"
        onClick={handleToggle}
        aria-label={open ? t("chat.closeLabel") : t("chat.launcherLabel")}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {open ? (
          <CloseRoundedIcon className="chat-toggle-close" />
        ) : (
          <PawBubble className="chat-toggle-glyph" />
        )}

        {!open && unseen > 0 ? (
          <span className="chat-toggle-unseen">
            {unseen > 9 ? "9+" : unseen}
          </span>
        ) : !open && othersOnline ? (
          <span className="chat-toggle-dot" aria-hidden="true" />
        ) : null}
      </button>
    </div>
  );
};

export default Chat;
