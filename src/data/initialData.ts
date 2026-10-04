import { Email, WhatsAppChat, DraftMessage, UserAccountConfig, LinkedContact } from '../types';

export const INITIAL_USER_ACCOUNT: UserAccountConfig = {
  email: 'babarzain322@gmail.com',
  whatsappNumber: '+1 415 890 2244',
  displayName: 'Zain Babar (Executive)',
  isConfigured: true,
};

export const INITIAL_LINKED_CONTACTS: LinkedContact[] = [
  {
    id: 'lc-ahmed',
    name: 'Ahmed Al-Mansoori',
    email: 'ahmed.almansoori@gulfcap.ae',
    whatsappNumber: '+971 50 123 7890',
    role: 'Managing Partner, Gulf Capital',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'lc-rashid',
    name: 'Rashid (Dubai Regional Lead)',
    email: 'rashid.almaktoum@nexuscorp.ae',
    whatsappNumber: '+971 50 892 3411',
    role: 'Managing Director, Middle East Operations',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'lc-sarah',
    name: 'Sarah Jenkins (CFO)',
    email: 'sarah.jenkins@nexuscorp.com',
    whatsappNumber: '+1 415 678 9901',
    role: 'Chief Financial Officer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'lc-amira',
    name: 'Amira (Executive Operations)',
    email: 'amira.ops@nexuscorp.com',
    whatsappNumber: '+971 55 432 1098',
    role: 'Head of Executive Operations & Travel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'lc-elena',
    name: 'Elena Rostova',
    email: 'elena.rostova@vancelegal.com',
    whatsappNumber: '+1 212 901 3344',
    role: 'Senior Partner, Venture & IP Law',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_EMAILS: Email[] = [
  {
    id: 'em-101',
    sender: {
      name: 'Ahmed Al-Mansoori',
      email: 'ahmed.almansoori@gulfcap.ae',
      title: 'Managing Partner, Gulf Capital Partners',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    recipients: [
      { name: 'Zain Babar (CEO)', email: 'babarzain322@gmail.com' }
    ],
    subject: 'Urgent: Q4 Strategic Deck & Valuation Model',
    snippet: 'Updated valuation model is attached. Board needs final approval on the $4.2M seed allocation before our 3:00 PM call.',
    body: `Dear Executive Team,

I have attached the finalized Q4 Strategic Pitch Deck along with our updated Gulf valuation model.

Key highlights:
1. Seed expansion round is capped at $4.2M with 72% institutional commitment already secured.
2. The sovereign co-investment syndicate from Abu Dhabi will sign upon our final greenlight.
3. Slide 4 requires your direct sign-off on the revenue multiplier assumptions before our 3:00 PM board sync today.

Please review the attached spreadsheets and deck. Let me know if you want to jump on a quick 10-minute briefing prior to the full session.

Best regards,
Ahmed Al-Mansoori
Managing Partner | Gulf Capital Partners
DIFC Gate Tower 4, Dubai, UAE`,
    date: 'Today, 9:15 AM',
    timestamp: '2026-10-04T09:15:00Z',
    unread: true,
    starred: true,
    folder: 'inbox',
    attachments: [
      { name: 'Q4_Strategic_Pitch_Deck_v4.pdf', size: '6.4 MB', type: 'deck' },
      { name: 'Valuation_Model_Q4_Allocation.xlsx', size: '1.8 MB', type: 'spreadsheet' },
    ],
    extractedMetadata: {
      dates: ['Today at 3:00 PM', 'October 12th closing'],
      amounts: ['$4,200,000'],
      meetingDetails: 'Board sync call today at 3:00 PM to finalize $4.2M seed allocation',
      actionItems: [
        { text: 'Review Slide 4 revenue multipliers in Q4 Strategic Deck', urgent: true, deadline: 'Today, 3:00 PM' },
        { text: 'Provide sign-off for Ahmed on valuation model', urgent: true, deadline: 'Today, 3:00 PM' }
      ]
    }
  },
  {
    id: 'em-102',
    sender: {
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@nexuscorp.com',
      title: 'Chief Financial Officer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    recipients: [
      { name: 'Zain Babar (CEO)', email: 'babarzain322@gmail.com' }
    ],
    subject: 'FY27 Runway & Escrow Transfer Confirmation',
    snippet: 'Net burn rate decreased by 14%. The $250,000 escrow deposit for the AI IP acquisition has been executed.',
    body: `Hi,

Following up on our financial governance committee review:
- Current runway stands at 24.5 months based on conservative yield models.
- The $250,000 deposit to the legal escrow account for the patent portfolio acquisition was transferred this morning.
- Action required: We need your formal signature on the banking resolution by Thursday 5:00 PM.

The full ledger breakdown is attached below for your records.

Warmly,
Sarah Jenkins
CFO, Nexus Group`,
    date: 'Yesterday, 4:45 PM',
    timestamp: '2026-10-03T16:45:00Z',
    unread: false,
    starred: true,
    folder: 'inbox',
    attachments: [
      { name: 'Escrow_Transfer_Receipt_250k.pdf', size: '420 KB', type: 'pdf' },
      { name: 'FY27_Runway_Sensitivity.xlsx', size: '2.1 MB', type: 'spreadsheet' }
    ],
    extractedMetadata: {
      dates: ['Thursday, 5:00 PM'],
      amounts: ['$250,000 escrow deposit'],
      meetingDetails: 'Governance Committee follow-up',
      actionItems: [
        { text: 'Sign banking resolution for legal escrow', urgent: false, deadline: 'Thursday, 5:00 PM' }
      ]
    }
  },
  {
    id: 'em-103',
    sender: {
      name: 'Elena Rostova',
      email: 'elena.rostova@vancelegal.com',
      title: 'Senior Partner, Venture & IP Law',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    },
    recipients: [
      { name: 'Zain Babar (CEO)', email: 'babarzain322@gmail.com' }
    ],
    subject: 'Term Sheet Revision - Redlined Master Agreement',
    snippet: 'Clause 8.3 governing founder veto rights and liquidation preference has been amended to 1.5x non-participating.',
    body: `Dear Executive,

Attached is the redlined version of the Master Investment Agreement following our counters from yesterday afternoon.

Amendments incorporated:
1. Liquidation preference set at 1.0x non-participating (defended successfully against 1.5x).
2. Board seat allocation preserves your affirmative vote on key IP transfers.
3. The exclusivity period expires on October 18th unless executed.

Please review the redlines in Term_Sheet_v3_Signed.pdf and confirm if we are clear to distribute to all co-investors.

Elena Rostova, Esq.
Vance & Rostova LLP`,
    date: 'Oct 2, 2:10 PM',
    timestamp: '2026-10-02T14:10:00Z',
    unread: false,
    starred: false,
    folder: 'inbox',
    attachments: [
      { name: 'Term_Sheet_v3_Signed.pdf', size: '1.2 MB', type: 'pdf' },
      { name: 'Redline_Comparison_Summary.pdf', size: '890 KB', type: 'pdf' }
    ],
    extractedMetadata: {
      dates: ['October 18th (exclusivity deadline)'],
      amounts: [],
      meetingDetails: 'Exclusivity window until Oct 18',
      actionItems: [
        { text: 'Confirm redlined terms in Term Sheet v3 for distribution', urgent: false, deadline: 'Oct 18th' }
      ]
    }
  },
  {
    id: 'em-104',
    sender: {
      name: 'Ahmed Al-Mansoori',
      email: 'ahmed.almansoori@gulfcap.ae',
      title: 'Managing Partner, Gulf Capital Partners',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    recipients: [
      { name: 'Zain Babar (CEO)', email: 'babarzain322@gmail.com' }
    ],
    subject: 'Follow-up: Dinner in DIFC next week',
    snippet: 'Let me know your travel dates for Dubai next week. Let’s catch up at Zuma on Tuesday evening around 8 PM.',
    body: `Hi,

Looking forward to your trip to Dubai next week. Let's make sure we set aside time for a private dinner at Zuma (DIFC) on Tuesday evening around 8:00 PM. 

Let me know if Tuesday works or if Wednesday dinner suits your flight schedule better.

Best,
Ahmed`,
    date: 'Oct 1, 11:30 AM',
    timestamp: '2026-10-01T11:30:00Z',
    unread: false,
    starred: false,
    folder: 'inbox',
    attachments: [],
    extractedMetadata: {
      dates: ['Next Tuesday at 8:00 PM'],
      amounts: [],
      meetingDetails: 'Dinner at Zuma DIFC, Tuesday 8:00 PM',
      actionItems: [
        { text: 'Confirm dinner availability with Ahmed for Zuma DIFC', urgent: false }
      ]
    }
  },
  {
    id: 'em-105',
    sender: {
      name: 'David Keller',
      email: 'david.keller@nexuscorp.com',
      title: 'Head of Global Infrastructure',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    recipients: [
      { name: 'Zain Babar (CEO)', email: 'babarzain322@gmail.com' }
    ],
    subject: 'Cloud Infrastructure Annual Contract Renewal ($185,000)',
    snippet: 'AWS enterprise discount negotiated down from $220k to $185,000/year. Contract signature needed before Friday.',
    body: `Hello,

We have concluded our annual enterprise renewal negotiations with AWS Enterprise. 
- Total committed spend: $185,000 (saves $35,000 vs list price).
- Includes $25,000 in promotional GPU computing credits for our AI pipeline.
- Needs your electronic signature in DocuSign before Friday 5:00 PM to lock in the tier.

Let me know if you would like me to resend the signing link.

David Keller`,
    date: 'Sep 30, 3:20 PM',
    timestamp: '2026-09-30T15:20:00Z',
    unread: false,
    starred: false,
    folder: 'inbox',
    attachments: [
      { name: 'AWS_Enterprise_Agreement_2026.pdf', size: '3.4 MB', type: 'pdf' }
    ],
    extractedMetadata: {
      dates: ['Friday 5:00 PM'],
      amounts: ['$185,000 renewal cost', '$35,000 savings', '$25,000 credits'],
      meetingDetails: '',
      actionItems: [
        { text: 'DocuSign AWS annual contract renewal ($185,000)', urgent: true, deadline: 'Friday, 5:00 PM' }
      ]
    }
  }
];

export const INITIAL_WHATSAPP_CHATS: WhatsAppChat[] = [
  {
    id: 'wa-chat-rashid',
    name: 'Rashid (Dubai Regional Lead)',
    phone: '+971 50 892 3411',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    role: 'Managing Director, Middle East Operations',
    unreadCount: 2,
    lastMessage: 'Action item: We need the delegation passport copies by Monday.',
    lastMessageTime: '10:24 AM',
    messages: [
      {
        id: 'msg-r-1',
        chatId: 'wa-chat-rashid',
        sender: 'contact',
        senderName: 'Rashid',
        senderPhone: '+971 50 892 3411',
        text: 'Salam! Quick update regarding the Dubai meeting with the Ministry officials next Wednesday.',
        timestamp: '10:20 AM',
        status: 'read'
      },
      {
        id: 'msg-r-2',
        chatId: 'wa-chat-rashid',
        sender: 'contact',
        senderName: 'Rashid',
        senderPhone: '+971 50 892 3411',
        text: 'They want to confirm the venue: Emirates Towers, Executive Floor 42, 11:00 AM. Can you confirm if you will attend in person?',
        timestamp: '10:22 AM',
        status: 'read'
      },
      {
        id: 'msg-r-3',
        chatId: 'wa-chat-rashid',
        sender: 'contact',
        senderName: 'Rashid',
        senderPhone: '+971 50 892 3411',
        text: 'Action item: We need the delegation passport copies by Monday morning to issue high-security building badges.',
        timestamp: '10:24 AM',
        status: 'delivered'
      }
    ]
  },
  {
    id: 'wa-chat-ahmed',
    name: 'Ahmed Al-Mansoori',
    phone: '+971 50 123 7890',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    role: 'Managing Partner, Gulf Capital',
    unreadCount: 1,
    lastMessage: 'Also, are you free for a 10 min sync at 4 PM today?',
    lastMessageTime: '9:40 AM',
    messages: [
      {
        id: 'msg-a-1',
        chatId: 'wa-chat-ahmed',
        sender: 'contact',
        senderName: 'Ahmed Al-Mansoori',
        senderPhone: '+971 50 123 7890',
        text: 'Hey, did you get a chance to check the updated slides I sent by email?',
        timestamp: '9:35 AM',
        status: 'read'
      },
      {
        id: 'msg-a-2',
        chatId: 'wa-chat-ahmed',
        sender: 'contact',
        senderName: 'Ahmed Al-Mansoori',
        senderPhone: '+971 50 123 7890',
        text: 'Also, are you free for a 10 min sync at 4 PM today before we lock in the figures?',
        timestamp: '9:40 AM',
        status: 'delivered'
      }
    ]
  },
  {
    id: 'wa-chat-sarah',
    name: 'Sarah Jenkins (CFO)',
    phone: '+1 415 678 9901',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    role: 'Chief Financial Officer',
    unreadCount: 0,
    lastMessage: 'Sent you the email confirmation as well.',
    lastMessageTime: 'Yesterday',
    messages: [
      {
        id: 'msg-s-1',
        chatId: 'wa-chat-sarah',
        sender: 'contact',
        senderName: 'Sarah Jenkins',
        senderPhone: '+1 415 678 9901',
        text: 'Wire transfer of $250,000 for the acquisition escrow has cleared without issues.',
        timestamp: 'Yesterday, 4:50 PM',
        status: 'read'
      },
      {
        id: 'msg-s-2',
        chatId: 'wa-chat-sarah',
        sender: 'contact',
        senderName: 'Sarah Jenkins',
        senderPhone: '+1 415 678 9901',
        text: 'Sent you the email confirmation as well with all the audit slips.',
        timestamp: 'Yesterday, 4:51 PM',
        status: 'read'
      },
      {
        id: 'msg-s-3',
        chatId: 'wa-chat-sarah',
        sender: 'user',
        senderName: 'You',
        senderPhone: '+1 415 000 1122',
        text: 'Excellent Sarah, thank you for tracking this closely.',
        timestamp: 'Yesterday, 5:10 PM',
        status: 'read'
      }
    ]
  },
  {
    id: 'wa-chat-amira',
    name: 'Amira (Executive Operations)',
    phone: '+971 55 432 1098',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'Head of Executive Operations & Travel',
    unreadCount: 0,
    lastMessage: 'Boarding pass will generate 24 hrs prior.',
    lastMessageTime: 'Wednesday',
    messages: [
      {
        id: 'msg-am-1',
        chatId: 'wa-chat-amira',
        sender: 'contact',
        senderName: 'Amira',
        senderPhone: '+971 55 432 1098',
        text: 'Flight itinerary to Dubai has been booked. Emirates EK204 departing JFK Oct 14th at 10:40 AM.',
        timestamp: 'Wednesday, 2:15 PM',
        status: 'read',
        attachments: [
          { name: 'Emirates_Flight_EK204_Itinerary.pdf', size: '680 KB', type: 'pdf' }
        ]
      },
      {
        id: 'msg-am-2',
        chatId: 'wa-chat-amira',
        sender: 'contact',
        senderName: 'Amira',
        senderPhone: '+971 55 432 1098',
        text: 'Car service from DXB Airport to The Bulgari Resort is arranged. Boarding pass will generate 24 hrs prior.',
        timestamp: 'Wednesday, 2:18 PM',
        status: 'read'
      }
    ]
  },
  {
    id: 'wa-chat-board',
    name: 'Nexus Executive Board',
    phone: 'Group (+6 members)',
    avatar: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=120&auto=format&fit=crop&q=80',
    role: 'Board of Directors',
    unreadCount: 0,
    lastMessage: 'Tariq: AGM date tentatively locked for Nov 14th in London.',
    lastMessageTime: 'Tuesday',
    messages: [
      {
        id: 'msg-b-1',
        chatId: 'wa-chat-board',
        sender: 'contact',
        senderName: 'Tariq Al-Sabah',
        senderPhone: '+965 99 123 456',
        text: 'Agenda for Q3 review is uploaded. Please review the governance packet in the shared secure drive.',
        timestamp: 'Tuesday, 11:00 AM',
        status: 'read'
      },
      {
        id: 'msg-b-2',
        chatId: 'wa-chat-board',
        sender: 'contact',
        senderName: 'Tariq Al-Sabah',
        senderPhone: '+965 99 123 456',
        text: 'AGM date tentatively locked for Nov 14th in London.',
        timestamp: 'Tuesday, 11:05 AM',
        status: 'read'
      }
    ]
  }
];

export const INITIAL_DRAFTS: DraftMessage[] = [];
