export const POLICY_UPDATED = 'October 8, 2026';
export const CONTACT_EMAIL = 'support@thesocialmatchgame.com';

export const policies = [
  {
    slug: 'age-policy',
    title: 'Age Policy',
    summary: 'The Social Match Game is for adults only. Here is how we verify and enforce that.',
    sections: [
      {
        heading: 'Adults Only',
        paragraphs: [
          'You must be at least 21 years old to create an account, sign in, or use any part of The Social Match Game. We do not permit anyone under 21, for any reason, including with parental consent.',
        ],
      },
      {
        heading: 'How We Verify Age',
        paragraphs: ['Every new member completes an age check before reaching the community:'],
        items: [
          'You enter your full date of birth. We calculate your age from it and do not rely on a typed-in age.',
          'You confirm that you are 21 or older and that the date you gave is accurate.',
          'If your date of birth shows you are under 21, your account cannot be completed and you are signed out.',
          'We may ask for additional verification, such as a government-issued ID check through a trusted provider, if we suspect an account does not meet the age requirement.',
        ],
      },
      {
        heading: 'Enforcement',
        items: [
          'Accounts found to belong to anyone under 21 are removed immediately, along with their profile, photos, and posts.',
          'Providing a false date of birth is a violation of our Terms of Service and results in permanent removal.',
          'Attempting to bypass the age check, including by creating new accounts after a failed check, results in a permanent ban.',
          'We do not knowingly collect personal information from anyone under 21. If we learn we have, we delete it promptly.',
        ],
      },
      {
        heading: 'Reporting a Suspected Minor',
        paragraphs: [
          `If you believe a member is under 21, report their profile through Feedback or email ${CONTACT_EMAIL}. We review these reports as a top priority.`,
        ],
      },
    ],
  },
  {
    slug: 'community-guidelines',
    title: 'Community Guidelines',
    summary: 'The standards every member agrees to uphold so this stays a respectful, safe space.',
    sections: [
      {
        heading: 'Our Purpose',
        paragraphs: [
          'The Social Match Game is a space to meet people, build friendships, and find love. These guidelines protect that experience for everyone.',
        ],
      },
      {
        heading: 'Relationship Resume Requirement',
        paragraphs: [
          'A Relationship Resume is required to use The Social Match Game. It is the core of every profile.',
        ],
        items: [
          'Create and publish your resume on The Relationship Resume, then send it to The Social Match Game from there.',
          'Your resume link is added to your profile automatically after you sign in and pass our age verification and policy acceptance. It cannot be typed in, pasted, or edited by hand.',
          'Until your resume is linked, you cannot use member features such as the directory, journal, or feedback board.',
          'Your resume must be your own and must follow these policies. Resumes that are false, impersonate someone else, or violate our guidelines can be unlinked and your account removed.',
          'Your published resume is visible to anyone with its link. Share only what you are comfortable making public.',
        ],
      },
      {
        heading: 'Be Respectful',
        items: [
          'Treat every member with dignity. Harassment, bullying, threats, and intimidation are not allowed.',
          'Hate speech and discrimination based on race, ethnicity, gender, sexual orientation, religion, disability, or age are not allowed.',
          'Accept a no. Do not keep contacting someone who has stopped responding or asked you to stop.',
        ],
      },
      {
        heading: 'Be Authentic',
        items: [
          'Use your own name, age, and photos. Do not impersonate another person.',
          'No fake profiles, catfishing, or misleading information about who you are.',
          'One person, one account.',
        ],
      },
      {
        heading: 'Keep It Safe',
        items: [
          'No sexually explicit content, nudity, or solicitation.',
          'No scams, requests for money, or financial exploitation. Never send money to someone you have not met.',
          'No spam, advertising, or promotion of outside services without our permission.',
          'Do not share another person’s private information, including their address, phone number, or messages, without consent.',
          'No content involving, depicting, or targeting minors.',
          'No illegal activity of any kind.',
        ],
      },
      {
        heading: 'Meeting in Person',
        items: [
          'Meet in a public place the first few times and tell a friend where you are going.',
          'Arrange your own transportation and trust your instincts. Leave if you feel uncomfortable.',
        ],
      },
      {
        heading: 'Reporting and Enforcement',
        paragraphs: [
          `Report violations through Feedback or email ${CONTACT_EMAIL}. Depending on severity, we may remove content, issue a warning, suspend an account, or permanently ban a member. Serious violations, including threats and anything involving minors, may be reported to law enforcement.`,
        ],
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    summary: 'The agreement between you and The Social Match Game when you use the service.',
    sections: [
      {
        heading: 'Accepting These Terms',
        paragraphs: [
          'By creating an account or using The Social Match Game, you agree to these Terms, our Privacy Policy, our Community Guidelines, and our Age Policy. If you do not agree, do not use the service.',
        ],
      },
      {
        heading: 'Relationship Resume Requirement',
        paragraphs: [
          'A Relationship Resume is required to use The Social Match Game. It is the core of every profile.',
        ],
        items: [
          'Create and publish your resume on The Relationship Resume, then send it to The Social Match Game from there.',
          'Your resume link is added to your profile automatically after you sign in and pass our age verification and policy acceptance. It cannot be typed in, pasted, or edited by hand.',
          'Until your resume is linked, you cannot use member features such as the directory, journal, or feedback board.',
          'Your resume must be your own and must follow these policies. Resumes that are false, impersonate someone else, or violate our guidelines can be unlinked and your account removed.',
          'Your published resume is visible to anyone with its link. Share only what you are comfortable making public.',
        ],
      },
      {
        heading: 'Eligibility',
        items: [
          'You must be at least 21 years old.',
          'You must provide accurate information, including your real date of birth.',
          'You may not use the service if you are barred from doing so by law or have previously been removed from it.',
        ],
      },
      {
        heading: 'Your Account',
        items: [
          'You sign in through a third-party account, such as Google or GitHub. You are responsible for keeping that account secure.',
          'You are responsible for activity on your account and for the content you post.',
          'You may delete your account at any time by contacting us.',
        ],
      },
      {
        heading: 'Your Content',
        paragraphs: [
          'You keep ownership of the content you post. You grant us a limited license to host, display, and distribute it as needed to operate the service. You promise that you have the right to post it and that it follows our Community Guidelines.',
        ],
      },
      {
        heading: 'Prohibited Conduct',
        paragraphs: [
          'You agree not to violate the Community Guidelines, misrepresent your age or identity, scrape or copy member data, interfere with the service, or use it for any unlawful purpose.',
        ],
      },
      {
        heading: 'Termination',
        paragraphs: [
          'We may suspend or remove accounts that violate these Terms, the Age Policy, or the Community Guidelines, with or without notice, especially where safety is at risk.',
        ],
      },
      {
        heading: 'No Guarantees',
        paragraphs: [
          'We do not guarantee matches, relationships, or the conduct of other members. We do not conduct criminal background checks on members. Use your own judgment when interacting with others, online and in person.',
        ],
      },
      {
        heading: 'Limitation of Liability',
        paragraphs: [
          'To the fullest extent permitted by law, the service is provided “as is,” and we are not liable for indirect or consequential damages arising from your use of it or your interactions with other members.',
        ],
      },
      {
        heading: 'Changes and Contact',
        paragraphs: [
          `We may update these Terms. When we make material changes, we will ask you to review and accept them again. Questions? Email ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    summary: 'What information we collect, why we collect it, and the choices you have.',
    sections: [
      {
        heading: 'Information We Collect',
        items: [
          'Account information from your social sign-in provider, such as your name, email address, and profile picture.',
          'Profile information you provide, such as your date of birth, age, gender, occupation, hobbies, and About Me.',
          'Content you post, including notes, feedback, and photos.',
          'Age verification records, including your date of birth, the date you confirmed you are 21 or older, and the policy version you accepted.',
          'Basic usage information, such as when you were last online.',
        ],
      },
      {
        heading: 'How We Use Information',
        items: [
          'To create your account and show your profile to other members.',
          'To verify that every member is an adult and to enforce our policies.',
          'To operate, secure, and improve the service.',
          'To respond to reports and support requests.',
        ],
      },
      {
        heading: 'Date of Birth',
        paragraphs: [
          'We use your date of birth only to verify your age. We display your age, never your full date of birth, to other members.',
        ],
      },
      {
        heading: 'Sharing',
        paragraphs: [
          'We do not sell your personal information. We share it only with service providers that help us run the service, when required by law, or to protect the safety of our members.',
        ],
      },
      {
        heading: 'Your Choices',
        items: [
          'You can edit your profile details at any time.',
          `You can ask us to access, correct, or delete your information by emailing ${CONTACT_EMAIL}.`,
          'You can disconnect your social account from the service by deleting your account.',
        ],
      },
      {
        heading: 'Retention and Security',
        paragraphs: [
          'We keep your information while your account is active and for a limited time afterward where needed for safety, legal, or fraud-prevention reasons. We use reasonable safeguards to protect it, but no system is completely secure.',
        ],
      },
      {
        heading: 'Children',
        paragraphs: [
          'The service is not for anyone under 21, and we do not knowingly collect information from minors. See our Age Policy.',
        ],
      },
    ],
  },
];

export const getPolicy = (slug) => policies.find((policy) => policy.slug === slug);
