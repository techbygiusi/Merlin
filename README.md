# 🧙‍♂️ Merlin: Your Homelab IP Management Tool

Welcome to **Merlin**! This intuitive web application is designed to simplify and streamline IP management for your homelab. Whether you’re running a small network or an extensive home setup, Merlin provides the tools you need to organize and monitor your IP addresses effortlessly.

<div align="center">
    <img src="image.png" alt="Merlin Dashboard" width="100%" />
</div>

## 🚀 Features

- **Add and Manage Subnets** ➕: Effortlessly add multiple subnets and delete them when needed.
- **IP Details and Customization** 📝: Assign names, descriptions, and links to specific IP addresses.
- **IP Status Management** ✅: Mark IPs as **Free**, **Reserved**, or **Blocked** for easy identification.
- **Efficient Filtering and Searching** 🔍: Quickly find and filter IPs based on your criteria.
- **Export Subnets** 📄: Download your subnet data as XML files for easy backup and sharing.
- **Statistics Overview** 📊: View a summary of free, reserved, and blocked IP addresses to monitor your network's usage.

With Merlin, managing your homelab IP addresses has never been so organized and efficient!

## 📜 Patch Notes

Stay informed about Merlin's updates and features:

- **1.0**: 🧙‍♂️ **Initial Release**: Welcome to Merlin, your new homelab IP management assistant!

## 🎨 Customization Guide

Merlin allows you to personalize the appearance of your web app. Customize colors easily through the `colors.css` file to fit your preferred style:

```css
:root {
  --color-scrollbar-track: #4a3e31;
  --color-scrollbar-thumb: #705a47;
  --color-scrollbar-thumb-hover: #a86f4e;

  --color-header-bg: #4a3e31;

  --color-free: #836746;
  --color-reserved: #b2a76b;
  --color-blocked: #c5894d;

  --color-background: #4a3e31;
  --background-image: none;
  --color-text: #d8cfc4;

  --color-placeholder-text: #a89f94;

  --color-modal-background: #5c4b3e;
  --color-modal-text: #d8cfc4;
  --color-tile-text: #d8cfc4;

  --color-button-bg: #c5894d;
  --color-button-bg-hover: #836746;
  --color-button-text: #d8cfc4;

  --color-searchbar: #705a47;
  --color-searchbar-text: #d8cfc4;
}
```

Adjust these variables to change the colors of your app elements, giving Merlin a look that suits your personal or homelab theme!
